/*
 * Whether this browser currently has a session, as far as the edge is
 * concerned, and nothing about what it contains. The Internal-JWT is an
 * HttpOnly cookie the page cannot read, so there is no expiry arithmetic:
 * the app only decides when to ask for a session, once before the first
 * protected request and once in answer to a refusal. `libs/identity/interceptors`
 * is the only caller.
 */
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IIdentityRefusalData } from '../@model/identity'
import { IdentityRefusal, isProviderChallenge, refusalForStatus } from '../@model/identity'
import { SessionProbe, probeSession, refusalFromError, requestSession } from '../libs/identity/session-bootstrap'
import { hasRecentHandoff, rememberHandoff } from '../libs/identity/identity-handoff'

// The path of the vendored Login route, under whatever base the build is
// served from.
const isLoginAddress = (pathname: string): boolean =>
  /\/login\/?$/.test(pathname)

/*
 * A target is navigated to only on this origin. The router hands back what
 * it was given, so a protocol-relative path (`//host/x`) would resolve to
 * somebody else's host; an address that is not ours falls back to the
 * current page, as if no target had been named.
 */
const isOurs = (target: string): boolean => {
  if (!target)
    return false

  try {
    return new URL(target, window.location.href).origin === window.location.origin
  }
  catch {
    return false
  }
}

export const useIdentityStore = defineStore('identity', () => {
  const refusal = ref<IIdentityRefusalData | null>(null)

  // The cookie is unreadable, so this says "we have been let in", not "the
  // credential is still valid"; the refusal path is what notices expiry.
  const isEstablished = ref(false)

  // Set when the grant said the account was just created (ADR-026): the
  // operator has a row and no rights, and is told so with the reference
  // an administrator can look up.
  const provisioned = ref<{ readonly requestId: string } | null>(null)

  /*
   * A page with a dozen requests in the air whose cookie just expired
   * produces a dozen refusals. Each carries the generation it was sent
   * with; the first to arrive bootstraps and moves the counter, the rest
   * repeat themselves without asking the issuer. One bootstrap per burst.
   */
  const generation = ref(0)

  // Kept out of the store's state: nothing renders it, and a fresh Pinia
  // gives a fresh one.
  let inFlight: Promise<boolean> | null = null

  /*
   * Once per page: ten requests failing together must not become ten
   * navigations. The navigation destroys this guard, so what makes "once"
   * hold across the reload is the marker in `libs/identity/identity-handoff`.
   */
  let challenged = false

  /*
   * Set when the operator signs out, and never cleared: the page is on its
   * way to the provider's logout. Outside the state on purpose, because the
   * vendored logout resets every store, and a reset `isEstablished` would
   * otherwise let the next navigation ask the issuer for a fresh cookie
   * while the old one is being expired.
   */
  let leaving = false

  // One probe answers a page full of unreadable answers; see
  // `followProviderChallenge`. The target is the first one named while it
  // runs: a chunk that failed to load is a destination, a failed request
  // on the current page is not.
  let probing: Promise<void> | null = null
  let pendingTarget = ''

  // A refusal is terminal until the operator asks to retry; otherwise an
  // unreachable registry would answer a page full of requests with a page
  // full of bootstraps. It also ends the session as far as the app is
  // concerned: a refused operator must not keep walking the protected
  // routes on data already in memory.
  const refuse = (data: IIdentityRefusalData): false => {
    refusal.value = data
    isEstablished.value = false
    provisioned.value = null

    return false
  }

  /*
   * Only a full page navigation can bring CF Access back: it answers an
   * XHR with a cross-origin redirect a script cannot follow, but a document
   * request gets its challenge and then the same page again.
   *
   * The page the provider returns the operator to is the one navigated to,
   * so the target is what they were after: the route whose chunk would not
   * load, or, with no target named, whatever the address bar holds. The
   * route guard keeps a refused operator where they were, so that is
   * normally the page they were working on. An address that is the Login
   * route (an old bookmark, a page opened before this build) would hand
   * them back to a page this build has no use for, so the root is asked for
   * instead and the guard picks the first page.
   */
  const navigateToProvider = (target = '') => {
    if (leaving)
      return

    challenged = true

    rememberHandoff()

    if (isOurs(target) && target !== window.location.href)
      window.location.assign(target)
    else if (isLoginAddress(window.location.pathname))
      window.location.assign(import.meta.env.BASE_URL || '/')
    else
      window.location.reload()
  }

  /*
   * The provider is only a remedy while the provider is what refused us.
   * When something else did (the edge not forwarding the assertion, an
   * Internal-JWT the backoffice rejects), CF Access answers the reload with
   * the same page and the app arrives back here having changed nothing, so
   * the second time it stops and says so.
   */
  const challenge = (requestId = '', target = ''): void => {
    if (challenged)
      return

    if (hasRecentHandoff()) {
      refuse({ code: IdentityRefusal.SignInDidNotHelp, requestId })

      return
    }

    navigateToProvider(target)
  }

  // The same navigation, offered rather than performed, for the cases the
  // probe below could not settle.
  const goToProvider = (): void => {
    navigateToProvider()
  }

  /*
   * An answer that could not be read is either the provider wanting the
   * operator back or no connection, and the probe tells which. The
   * provider's challenge is followed at once (Q42: there is no renewal in
   * the background to wait for, and a notice would only add a click), to the
   * target so the provider hands the operator back there. No connection is
   * explained with a retry. A status is the issuer's own verdict, read the
   * way a bootstrap answer is. A status that says the route works leaves
   * the original failure unexplained (a blip, or a request of ours CF
   * answered differently), so there the navigation is offered, not taken.
   */
  const settleUnreadableAnswer = async (): Promise<void> => {
    const verdict = await probeSession()

    if (verdict === SessionProbe.Challenge) {
      challenge('', pendingTarget)

      return
    }

    if (verdict === SessionProbe.Offline) {
      refuse({ code: IdentityRefusal.RegistryUnavailable, requestId: '' })

      return
    }

    const code = verdict < 300 ? IdentityRefusal.ProviderSignInNeeded : refusalForStatus(verdict)

    refuse({ code, requestId: '', status: verdict })

    if (code === IdentityRefusal.AccessNotConfirmed)
      challenge('', pendingTarget)
  }

  // Once per page, like the navigation it may end in: a burst of failed
  // requests shares the one probe, and a page already on its way needs none.
  const followProviderChallenge = (target = ''): Promise<void> => {
    if (leaving || challenged)
      return Promise.resolve()

    pendingTarget ||= target

    if (!probing) {
      probing = settleUnreadableAnswer().finally(() => {
        probing = null
        pendingTarget = ''
      })
    }

    return probing
  }

  const runBootstrap = async (): Promise<boolean> => {
    try {
      const grant = await requestSession()

      refusal.value = null
      isEstablished.value = true
      // Sticky: the requests that follow the creation renew the session on
      // an ordinary grant within seconds, and the notice must outlive that.
      if (grant?.provisioned)
        provisioned.value = { requestId: grant.requestId }
      generation.value += 1

      // The handoff marker is deliberately not cleared here: a granted
      // session proves the issuer answered, not that the backoffice accepts
      // the credential. A protected request that worked settles it, in
      // `libs/identity/interceptors`.
      return true
    }
    catch (error) {
      // An unreadable answer has the same shape as a dropped connection;
      // the probe settles which, and moves the page only for the provider.
      if (isProviderChallenge(error)) {
        await followProviderChallenge()

        return false
      }

      const data = refusalFromError(error)

      refuse(data)

      // A 401 on the bootstrap means the provider's assertion was absent or
      // not accepted, and only a real navigation can get a new one. The
      // rest are explained in place.
      if (data.code === IdentityRefusal.AccessNotConfirmed)
        challenge(data.requestId)

      return false
    }
  }

  const bootstrap = (): Promise<boolean> => {
    if (leaving)
      return Promise.resolve(false)

    if (!inFlight) {
      inFlight = runBootstrap().finally(() => {
        inFlight = null
      })
    }

    return inFlight
  }

  // Before the first protected request, and only then. No timer, no expiry
  // arithmetic: the refusal path below handles expiry.
  const ensureSession = async (): Promise<boolean> => {
    if (refusal.value)
      return false

    if (isEstablished.value)
      return true

    return await bootstrap()
  }

  // The refusal path. The generation the request was sent under is what
  // keeps a burst cheap.
  const renew = async (sentGeneration: number): Promise<boolean> => {
    if (refusal.value)
      return false

    if (generation.value !== sentGeneration)
      return true

    return await bootstrap()
  }

  // The session is over for this page; nothing may open another. What it
  // returns settles once a bootstrap already on its way has landed, so the
  // cookie it sets is not the one left standing after the edge expired it.
  const leave = (): Promise<unknown> => {
    leaving = true
    isEstablished.value = false
    provisioned.value = null

    return inFlight ?? Promise.resolve()
  }

  // What the operator's "try again" does after a registry outage.
  const retry = async (): Promise<boolean> => {
    refusal.value = null
    isEstablished.value = false

    return await bootstrap()
  }

  return {
    refusal,
    isEstablished,
    provisioned,
    generation,
    ensureSession,
    renew,
    retry,
    challenge,
    goToProvider,
    followProviderChallenge,
    leave,

    // The request layer sees one refusal the bootstrap cannot: a request
    // refused twice running, the second time under a fresh session.
    recordRefusal: refuse,
  }
})
