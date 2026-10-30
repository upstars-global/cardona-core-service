import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IdentityRefusal, refusalForStatus } from '../../../src/@model/identity'
import { useIdentityStore } from '../../../src/stores/identity'

const requestSessionMock = vi.hoisted(() => vi.fn())
const refusalFromErrorMock = vi.hoisted(() => vi.fn())
const probeSessionMock = vi.hoisted(() => vi.fn())

// The probe's vocabulary, as the real module spells it.
const SessionProbe = vi.hoisted(() => ({ Challenge: 'challenge', Offline: 'offline' } as const))

vi.mock('../../../src/libs/identity/session-bootstrap', () => ({
  requestSession: requestSessionMock,
  refusalFromError: refusalFromErrorMock,
  probeSession: probeSessionMock,
  requestIdOf: () => '',
  SessionProbe,
}))

// jsdom refuses to navigate, and going back to the provider is a full
// page navigation by design.
const reloadMock = vi.fn()
const assignMock = vi.fn()

Object.defineProperty(window, 'location', {
  value: { ...window.location, pathname: '/', reload: reloadMock, assign: assignMock },
  writable: true,
})

const httpError = (status: number, requestId = 'req-1') => ({
  isAxiosError: true,
  response: { status, data: { error: 'access_denied', requestId }, headers: {} },
})

// A cross-origin redirect to the provider's sign-in page, as axios reports
// it: no status, no body, because the browser will not let a script read
// somebody else's answer.
const providerRedirect = () => Object.assign(new Error('Network Error'), { code: 'ERR_NETWORK' })

describe('identity store', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    setActivePinia(createPinia())
    vi.resetAllMocks()

    refusalFromErrorMock.mockImplementation((error: any) => ({
      code: refusalForStatus(error?.response?.status),
      requestId: error?.response?.data?.requestId ?? '',
      status: error?.response?.status,
    }))
    probeSessionMock.mockResolvedValue(SessionProbe.Challenge)
  })

  it('should ask for a session before the first protected request and not again', async () => {
    const store = useIdentityStore()

    expect(await store.ensureSession()).toBe(true)
    expect(await store.ensureSession()).toBe(true)

    // No stated lifetime, so only the refusal path notices expiry.
    expect(requestSessionMock).toHaveBeenCalledTimes(1)
    expect(store.isEstablished).toBe(true)
  })

  describe('renewal ahead of the stated expiry', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should keep the session while it is well inside its lifetime', async () => {
      requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '', expiresIn: 60 })

      const store = useIdentityStore()

      await store.ensureSession()
      vi.advanceTimersByTime(49_000)

      expect(await store.ensureSession()).toBe(true)
      expect(requestSessionMock).toHaveBeenCalledTimes(1)
    })

    it('should ask for a new session ten seconds before the lifetime ends', async () => {
      requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '', expiresIn: 60 })

      const store = useIdentityStore()

      await store.ensureSession()

      const before = store.generation

      vi.advanceTimersByTime(50_000)

      expect(await store.ensureSession()).toBe(true)
      expect(requestSessionMock).toHaveBeenCalledTimes(2)
      expect(store.generation).toBe(before + 1)
    })

    it('should use half of a short lifetime as the margin', async () => {
      requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '', expiresIn: 8 })

      const store = useIdentityStore()

      await store.ensureSession()
      vi.advanceTimersByTime(3_900)
      await store.ensureSession()

      expect(requestSessionMock).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(200)
      await store.ensureSession()

      expect(requestSessionMock).toHaveBeenCalledTimes(2)
    })

    it('should give a burst of requests one renewal', async () => {
      requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '', expiresIn: 60 })

      const store = useIdentityStore()

      await store.ensureSession()
      vi.advanceTimersByTime(55_000)

      await Promise.all([store.ensureSession(), store.ensureSession(), store.ensureSession()])

      expect(requestSessionMock).toHaveBeenCalledTimes(2)
    })

    it('should not renew on a timer', async () => {
      requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '', expiresIn: 60 })

      const store = useIdentityStore()

      await store.ensureSession()
      vi.advanceTimersByTime(600_000)

      expect(requestSessionMock).toHaveBeenCalledTimes(1)
    })

    it('should not renew a session the operator is leaving', async () => {
      requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '', expiresIn: 60 })

      const store = useIdentityStore()

      await store.ensureSession()
      await store.leave()
      vi.advanceTimersByTime(55_000)

      expect(await store.ensureSession()).toBe(false)
      expect(requestSessionMock).toHaveBeenCalledTimes(1)
    })

    it('should not renew while no lifetime was stated', async () => {
      requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '', expiresIn: null })

      const store = useIdentityStore()

      await store.ensureSession()
      vi.advanceTimersByTime(600_000)
      await store.ensureSession()

      expect(requestSessionMock).toHaveBeenCalledTimes(1)
    })
  })

  it('should hold no credential of any kind', async () => {
    // The bootstrap answers with a `Set-Cookie` the page cannot read.
    // Handed a token anyway, the store must keep none of it.
    requestSessionMock.mockResolvedValueOnce({ token: 'header.payload.signature', ttl: 60, type: 'Bearer' })

    // Something already in storage, so "the store wrote nothing" is an
    // observation rather than a statement about an empty jar.
    localStorage.setItem('unrelated-key', 'unrelated-value')

    const store = useIdentityStore()

    await store.ensureSession()

    expect(JSON.stringify(store.$state)).not.toMatch(/token|jwt|bearer/i)

    // Nothing of its own in either jar: the handoff marker is written by
    // `challenge`, and no session was refused here.
    expect(Object.keys(localStorage)).toEqual(['unrelated-key'])
    expect(Object.keys(sessionStorage)).toEqual([])
  })

  it('should collapse a burst of simultaneous asks into one bootstrap', async () => {
    const store = useIdentityStore()

    let release: () => void = () => {}

    requestSessionMock.mockImplementationOnce(() => new Promise<void>(resolve => {
      release = resolve
    }))

    const asks = Promise.all([store.ensureSession(), store.ensureSession(), store.ensureSession()])

    release()

    expect(await asks).toEqual([true, true, true])
    expect(requestSessionMock).toHaveBeenCalledTimes(1)
  })

  it('should not bootstrap again for a session somebody else already renewed', async () => {
    const store = useIdentityStore()

    await store.ensureSession()

    const sent = store.generation

    expect(await store.renew(sent)).toBe(true)
    expect(requestSessionMock).toHaveBeenCalledTimes(2)

    // A request that failed under the old session arrives late. The
    // session it used is gone, so there is nothing to renew.
    expect(await store.renew(sent)).toBe(true)
    expect(requestSessionMock).toHaveBeenCalledTimes(2)
  })

  it('should hand the page to the provider when the bootstrap itself is refused', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValueOnce(httpError(401))

    expect(await store.ensureSession()).toBe(false)
    expect(store.refusal?.code).toBe(IdentityRefusal.AccessNotConfirmed)

    // An XHR cannot bring CF Access back: only a document request can be
    // answered with its challenge.
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  // The reload erases every variable this store holds, so "we have already
  // tried this" must survive it in sessionStorage.
  it('should not hand the page over a second time when the handover changed nothing', async () => {
    requestSessionMock.mockRejectedValue(httpError(401))

    expect(await useIdentityStore().ensureSession()).toBe(false)
    expect(reloadMock).toHaveBeenCalledTimes(1)

    // The reload as the browser performs it: a fresh store, and only
    // `sessionStorage` carried across.
    setActivePinia(createPinia())
    reloadMock.mockClear()

    const store = useIdentityStore()

    expect(await store.ensureSession()).toBe(false)
    expect(reloadMock).not.toHaveBeenCalled()

    // An explanation the operator can read, and the reference to quote.
    expect(store.refusal).toEqual({ code: IdentityRefusal.SignInDidNotHelp, requestId: 'req-1' })
  })

  // A cross-origin redirect and a dropped connection are the same
  // `ERR_NETWORK` to an XHR; the probe tells them apart, and only the
  // provider's challenge moves the page (Q42: straight to sign-in, no notice).
  it('should go straight to the provider when the probe confirms its challenge on the bootstrap', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValueOnce(providerRedirect())
    probeSessionMock.mockResolvedValueOnce(SessionProbe.Challenge)

    expect(await store.ensureSession()).toBe(false)

    expect(reloadMock).toHaveBeenCalledTimes(1)
    expect(store.refusal).toBeNull()
  })

  it('should explain no connection with a retry, and not move the page, when the probe fell through', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValueOnce(providerRedirect())
    probeSessionMock.mockResolvedValueOnce(SessionProbe.Offline)

    expect(await store.ensureSession()).toBe(false)

    expect(store.refusal?.code).toBe(IdentityRefusal.RegistryUnavailable)
    expect(reloadMock).not.toHaveBeenCalled()
    expect(assignMock).not.toHaveBeenCalled()
  })

  describe('following the provider challenge', () => {
    it('should navigate to the target page the operator asked for', async () => {
      await useIdentityStore().followProviderChallenge('/p/payouts/requests?page=2')

      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledWith('/p/payouts/requests?page=2')
      expect(reloadMock).not.toHaveBeenCalled()
    })

    it('should put no notice on screen on the way to the provider', async () => {
      const store = useIdentityStore()

      await store.followProviderChallenge('/p/x')

      expect(store.refusal).toBeNull()
    })

    it('should reload the page the operator is on when no target is named', async () => {
      await useIdentityStore().followProviderChallenge()

      expect(reloadMock).toHaveBeenCalledTimes(1)
      expect(assignMock).not.toHaveBeenCalled()
    })

    it('should leave a mark so that coming back unchanged is recognised', async () => {
      await useIdentityStore().followProviderChallenge('/p/x')

      expect(sessionStorage.getItem('identity.handoff')).not.toBeNull()
    })

    // The reload erases the store; the marker in sessionStorage is what
    // says the provider was already tried, and a second challenge within
    // the window is a loop, not a renewal.
    it('should stop and say so instead of going a second time right after coming back', async () => {
      sessionStorage.setItem('identity.handoff', String(Date.now()))

      const store = useIdentityStore()

      await store.followProviderChallenge('/p/x')

      expect(assignMock).not.toHaveBeenCalled()
      expect(reloadMock).not.toHaveBeenCalled()
      expect(store.refusal?.code).toBe(IdentityRefusal.SignInDidNotHelp)
    })

    it('should explain no connection with a retry rather than navigate', async () => {
      probeSessionMock.mockResolvedValueOnce(SessionProbe.Offline)

      const store = useIdentityStore()

      await store.followProviderChallenge('/p/x')

      expect(store.refusal?.code).toBe(IdentityRefusal.RegistryUnavailable)
      expect(assignMock).not.toHaveBeenCalled()
      expect(reloadMock).not.toHaveBeenCalled()
    })

    it('should explain a blocked operator rather than navigate', async () => {
      probeSessionMock.mockResolvedValueOnce(403)

      const store = useIdentityStore()

      await store.followProviderChallenge('/p/x')

      expect(store.refusal?.code).toBe(IdentityRefusal.AccessNotGranted)
      expect(assignMock).not.toHaveBeenCalled()
      expect(reloadMock).not.toHaveBeenCalled()
    })

    // The route answered as if nothing were wrong: the failure that brought
    // us here is unexplained, so the page is not taken from under the
    // operator; the way to the provider is offered.
    it('should offer the way to the provider, not take it, when the route itself answers fine', async () => {
      probeSessionMock.mockResolvedValueOnce(200)

      const store = useIdentityStore()

      await store.followProviderChallenge('/p/x')

      expect(store.refusal?.code).toBe(IdentityRefusal.ProviderSignInNeeded)
      expect(assignMock).not.toHaveBeenCalled()
      expect(reloadMock).not.toHaveBeenCalled()

      store.goToProvider()

      expect(reloadMock).toHaveBeenCalledTimes(1)
    })

    // The router hands back what it was given, so a protocol-relative
    // path would leave this origin; the sink keeps the page on it.
    it('should not navigate to a target on another origin, protocol-relative or not', async () => {
      const store = useIdentityStore()

      await store.followProviderChallenge('//evil.com/x')

      expect(assignMock).not.toHaveBeenCalledWith('//evil.com/x')
      expect(assignMock).not.toHaveBeenCalled()
      expect(reloadMock).toHaveBeenCalledTimes(1)
    })

    it('should navigate to an absolute target on this origin', async () => {
      const target = `${window.location.origin}/p/payouts/requests`

      await useIdentityStore().followProviderChallenge(target)

      expect(assignMock).toHaveBeenCalledWith(target)
    })

    // A ping on page A starts the probe; a menu click whose chunk fails
    // joins it. The destination is the click's, not page A.
    it('should keep the target a later caller names while a probe without one is in flight', async () => {
      let answer: (verdict: string) => void = () => {}

      probeSessionMock.mockReturnValueOnce(new Promise(resolve => {
        answer = resolve
      }))

      const store = useIdentityStore()
      const first = store.followProviderChallenge()
      const second = store.followProviderChallenge('/p/payouts/requests?page=2')

      answer(SessionProbe.Challenge)
      await Promise.all([first, second])

      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledWith('/p/payouts/requests?page=2')
      expect(reloadMock).not.toHaveBeenCalled()
    })

    it('should carry the target through a 401 answered by the probe as well', async () => {
      probeSessionMock.mockResolvedValueOnce(401)

      await useIdentityStore().followProviderChallenge('/p/x')

      expect(assignMock).toHaveBeenCalledWith('/p/x')
    })

    it('should probe once and navigate once for a burst of failures', async () => {
      const store = useIdentityStore()

      await Promise.all([
        store.followProviderChallenge('/p/x'),
        store.followProviderChallenge('/p/x'),
        store.followProviderChallenge('/p/y'),
      ])

      expect(probeSessionMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledTimes(1)
    })

    it('should not probe again once the page is on its way', async () => {
      const store = useIdentityStore()

      await store.followProviderChallenge('/p/x')
      await store.followProviderChallenge('/p/y')

      expect(probeSessionMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledTimes(1)
    })
  })

  // The provider returns the operator to the address the page had, so the
  // navigation must keep it: the page they were on, never the Login route.
  describe('where the navigation to the provider leads', () => {
    const pathname = window.location.pathname

    afterEach(() => {
      window.location.pathname = pathname
    })

    it('should reload the page the operator is on', () => {
      window.location.pathname = '/p/payouts/requests'

      useIdentityStore().goToProvider()

      expect(reloadMock).toHaveBeenCalledTimes(1)
      expect(assignMock).not.toHaveBeenCalled()
    })

    it('should not hand the operator back to the Login route', () => {
      window.location.pathname = '/login'

      useIdentityStore().goToProvider()

      expect(reloadMock).not.toHaveBeenCalled()
      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock.mock.calls[0][0]).not.toMatch(/login/)
    })
  })

  it('should navigate once however many asks fail together', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValue(httpError(401))

    await Promise.all([store.ensureSession(), store.ensureSession()])
    await store.retry()

    // Ten requests failing together must not become ten navigations, and
    // after the first the page is leaving anyway.
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('should explain a blocked operator without navigating', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValueOnce(httpError(403, 'req-403'))

    expect(await store.ensureSession()).toBe(false)
    expect(store.refusal).toEqual({ code: IdentityRefusal.AccessNotGranted, requestId: 'req-403', status: 403 })
    expect(reloadMock).not.toHaveBeenCalled()
  })

  it('should tell an unreachable registry apart from a refusal', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValueOnce(httpError(503, 'req-503'))

    expect(await store.ensureSession()).toBe(false)
    expect(store.refusal?.code).toBe(IdentityRefusal.RegistryUnavailable)
    expect(reloadMock).not.toHaveBeenCalled()
  })

  // With the route proxied to the backoffice, the session route answers
  // 404: a deployment fault, not an outage.
  it('should tell a session route that is not deployed apart from an outage', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValueOnce(httpError(404, 'req-404'))

    expect(await store.ensureSession()).toBe(false)
    expect(store.refusal?.code).toBe(IdentityRefusal.SessionNotConfigured)
    expect(store.refusal?.status).toBe(404)
    expect(reloadMock).not.toHaveBeenCalled()
  })

  // A refusal that arrives after the session was granted (the cookie expired
  // and the renewal was refused, the provider's own session went away) ends
  // the session: the guard must not keep admitting the operator on it.
  it('should no longer count as established once refused', async () => {
    const store = useIdentityStore()

    expect(await store.ensureSession()).toBe(true)
    expect(store.isEstablished).toBe(true)

    store.recordRefusal({ code: IdentityRefusal.ProviderSignInNeeded, requestId: '' })

    expect(store.isEstablished).toBe(false)
    expect(await store.ensureSession()).toBe(false)
    expect(requestSessionMock).toHaveBeenCalledTimes(1)
  })

  // ADR-026: the grant that created the account is remembered until the
  // session is refused, so the no-access page can say what happened.
  it('should remember a provisioning grant and forget it on a refusal', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockResolvedValueOnce({ provisioned: true, requestId: 'req-new' })
    await store.ensureSession()
    expect(store.provisioned).toEqual({ requestId: 'req-new' })

    store.recordRefusal({ code: IdentityRefusal.AccessNotGranted, requestId: 'req-403' })
    expect(store.provisioned).toBeNull()
  })

  // The requests right after the creation renew the session on an ordinary
  // grant; the notice has to survive that renewal.
  it('should keep the provisioning grant across a later ordinary renewal', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockResolvedValueOnce({ provisioned: true, requestId: 'req-new' })
    await store.ensureSession()

    requestSessionMock.mockResolvedValueOnce({ provisioned: false, requestId: 'req-2' })
    await store.retry()

    expect(store.provisioned).toEqual({ requestId: 'req-new' })
  })

  it('should remember nothing of an ordinary grant', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockResolvedValueOnce({ provisioned: false, requestId: 'req-1' })
    await store.ensureSession()

    expect(store.provisioned).toBeNull()
  })

  it('should stop asking once refused, and start again only on retry', async () => {
    const store = useIdentityStore()

    requestSessionMock.mockRejectedValueOnce(httpError(503))
    await store.ensureSession()
    expect(requestSessionMock).toHaveBeenCalledTimes(1)

    // Every request behind the failed one asks, and none of them reaches
    // the issuer: an outage costs one call, not one per request.
    await Promise.all([store.ensureSession(), store.ensureSession(), store.renew(store.generation)])
    expect(requestSessionMock).toHaveBeenCalledTimes(1)

    expect(await store.retry()).toBe(true)
    expect(store.refusal).toBeNull()
    expect(requestSessionMock).toHaveBeenCalledTimes(2)
  })
})
