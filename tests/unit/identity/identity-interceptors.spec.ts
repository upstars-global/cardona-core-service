/*
 * Nothing here is stubbed except the network: the real axios instance, the
 * real interceptors, the real store and the real bootstrap client. The
 * properties under test (one bootstrap, one retry, never the bootstrap
 * itself, one handover) are properties of how those pieces are wired.
 */
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IDENTITY_REFUSED_TYPE, IdentityRefusal } from '../../../src/@model/identity'

const SESSION_URL = '/api/auth/session'
const API_URL = '/api/v2/players/list'

// The activity ping, sent every three minutes while the operator is active.
const PING_URL = '/api/v2/users/session-logs/ping'

// The shape the backoffice answers a refused credential with: HTTP 200,
// refusal in the body.
const REFUSED = 'TOKEN_INVALID'
const EXPIRED = 'TOKEN_EXPIRED'

// A cross-origin redirect to CF Access, as a script sees it: not a status.
const NOT_OURS = 'not-ours'

// What the existing way in puts on the wire, seeded so the credential
// assertions below are made against a wire that can carry one.
const VENDORED = 'Bearer vendored-token'

const sent: string[] = []

let sessionAnswers: Array<number | string> = []
let apiAnswers: Array<number | string> = []

const { AxiosError } = await import('axios')

const failure = (config: any, status: number) => new AxiosError(
  `Request failed with status code ${status}`,
  AxiosError.ERR_BAD_REQUEST,
  config,
  null,
  { data: { error: 'access_denied', requestId: 'req-1' }, status, statusText: '', headers: {}, config },
)

const unreadable = (config: any) =>
  new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, null)

const success = (config: any, data: unknown) =>
  ({ data, status: 200, statusText: 'OK', headers: {}, config, request: {} })

const adapter = vi.fn(async (config: any) => {
  sent.push(config.url)

  const answer = config.url === SESSION_URL ? sessionAnswers.shift() : apiAnswers.shift()

  if (answer === NOT_OURS)
    throw unreadable(config)

  if (typeof answer === 'number')
    throw failure(config, answer)

  // A string that is not `NOT_OURS` is the backoffice's own shape.
  if (typeof answer === 'string')
    return success(config, { requestId: 'req-1', error: { type: answer } })

  return success(config, { data: 'ok' })
})

// The adapter has to be in place before anything creates a client from these
// defaults; the bootstrap client copies them the first time it is used.
const axios = (await import('axios')).default

axios.defaults.adapter = adapter
axios.defaults.headers.common.Authorization = VENDORED

/*
 * The probe the store sends after an answer that is not ours: `fetch` with
 * `redirect: 'manual'`, which reports the provider's redirect as an
 * `opaqueredirect` where an XHR reports a network error.
 */
const PROBE_CHALLENGE = 'challenge'
const PROBE_OFFLINE = 'offline'

let probeAnswers: Array<string | number> = []

const fetchMock = vi.fn(async (url: string) => {
  sent.push(`probe:${url}`)

  const answer = probeAnswers.shift() ?? PROBE_CHALLENGE

  if (answer === PROBE_OFFLINE)
    throw new TypeError('Failed to fetch')

  if (answer === PROBE_CHALLENGE)
    return { type: 'opaqueredirect', status: 0 }

  return { type: 'basic', status: answer }
})

vi.stubGlobal('fetch', fetchMock)

// jsdom refuses to navigate, and handing the page to CF Access is a full
// page navigation by design.
const reloadMock = vi.fn()

Object.defineProperty(window, 'location', {
  value: { ...window.location, reload: reloadMock },
  writable: true,
})

const { useIdentityStore } = await import('../../../src/stores/identity')
const installIdentity = (await import('../../../src/libs/identity/interceptors')).default

// Installed once: installing per test would stack interceptors and make
// "one retry" meaningless.
vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')
installIdentity()

const callsTo = (url: string) => sent.filter(request => request === url)

const configFor = (url: string) =>
  adapter.mock.calls.map(([config]: any[]) => config).find((config: any) => config.url === url)

describe('identity request interceptors', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')
    setActivePinia(createPinia())
    sessionStorage.clear()
    sent.length = 0
    sessionAnswers = []
    apiAnswers = []
    probeAnswers = []
    adapter.mockClear()
    fetchMock.mockClear()
    reloadMock.mockClear()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should leave requests alone while the bootstrap branch is off', async () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')

    apiAnswers = [REFUSED]

    const { data } = await axios.post(API_URL, {})

    expect(data.error.type).toBe(REFUSED)
    expect(callsTo(SESSION_URL)).toHaveLength(0)
    expect(callsTo(API_URL)).toHaveLength(1)
  })

  it('should open a session before the first protected request and not before the rest', async () => {
    await axios.post(API_URL, {})
    await axios.post(API_URL, {})

    expect(callsTo(SESSION_URL)).toHaveLength(1)
    expect(callsTo(API_URL)).toHaveLength(2)
  })

  it('should put no credential of its own on a protected request', async () => {
    await axios.post(API_URL, {})

    // The cookie is HttpOnly and the edge converts it; the existing way in
    // still owns this header, and this layer neither adds nor replaces it.
    expect(configFor(API_URL).headers.get('Authorization')).toBe(VENDORED)
  })

  it('should keep the bootstrap free of the credential the app is carrying', async () => {
    await axios.post(API_URL, {})

    // `axios.create()` copies `axios.defaults`, so the issuer client
    // inherits `Authorization` unless something takes it off.
    expect(configFor(SESSION_URL).headers.get('Authorization')).toBeFalsy()
  })

  // The backoffice answers a refused credential with HTTP 200 and
  // `error.type`, so a condition on the status alone would never fire.
  it('should recognise the backoffice HTTP 200 refusal shape as an authentication failure', async () => {
    for (const shape of [REFUSED, EXPIRED]) {
      setActivePinia(createPinia())
      sessionStorage.clear()
      sent.length = 0
      apiAnswers = [shape]

      const { data } = await axios.post(API_URL, {})

      expect(data).toEqual({ data: 'ok' })
      expect(callsTo(API_URL)).toHaveLength(2)
      expect(callsTo(SESSION_URL)).toHaveLength(2)
    }
  })

  // A plain 401 is the edge refusing a request that lost its cookie (the
  // browser dropped `app_session` on expiry): renew once, repeat once, and
  // nothing to show the operator.
  it('should also treat a plain 401 as a refused credential', async () => {
    apiAnswers = [401]

    const { data } = await axios.post(API_URL, {})

    expect(data).toEqual({ data: 'ok' })
    expect(callsTo(API_URL)).toHaveLength(2)
    expect(callsTo(SESSION_URL)).toHaveLength(2)
    expect(useIdentityStore().refusal).toBeNull()
  })

  // The backoffice could not check the credential at all (its copy of the
  // issuer's keys is unreachable) and says so with HTTP 200 as well. A new
  // session would not help, so no renewal; the operator gets the same
  // retryable notice an unreachable issuer gets.
  it('should treat a backoffice that cannot check the credential as an outage, not a refusal', async () => {
    apiAnswers = ['IDENTITY_PROVIDER_UNAVAILABLE']

    const thrown = await axios.post(API_URL, {}).catch(error => error)

    expect(thrown.type).toBe(IDENTITY_REFUSED_TYPE)
    expect(thrown.code).toBe(IdentityRefusal.RegistryUnavailable)
    expect(thrown.requestId).toBe('req-1')
    expect(callsTo(API_URL)).toHaveLength(1)
    expect(callsTo(SESSION_URL)).toHaveLength(1)
    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.RegistryUnavailable)
    expect(reloadMock).not.toHaveBeenCalled()
  })

  // A permissions verdict comes back as `UNAUTHORIZED`, and a new session
  // cannot change a verdict: the envelope passes through untouched.
  it('should not exchange a session for a permissions verdict', async () => {
    apiAnswers = ['UNAUTHORIZED']

    const { data } = await axios.post(API_URL, {})

    expect(data).toEqual({ requestId: 'req-1', error: { type: 'UNAUTHORIZED' } })
    expect(callsTo(API_URL)).toHaveLength(1)
    expect(callsTo(SESSION_URL)).toHaveLength(1)
  })

  // An exhausted request rejects with the identity plugin's own error.
  const exhausted = (p: Promise<unknown>, code?: IdentityRefusal) =>
    expect(p).rejects.toMatchObject(code === undefined
      ? { type: IDENTITY_REFUSED_TYPE }
      : { type: IDENTITY_REFUSED_TYPE, code })

  it('should stop after the second refusal instead of looping', async () => {
    apiAnswers = [REFUSED, REFUSED]

    // Exhaustion leaves as the plugin's own error, never as the backoffice
    // envelope, which the vendored ApiService would answer with clearAuth()
    // + /login and wipe the refusal it is about to show.
    await exhausted(axios.post(API_URL, {}), IdentityRefusal.AccessNotConfirmed)
    await flushPromises()

    // Two attempts and two bootstraps; a loop would show as a larger count.
    expect(callsTo(API_URL)).toHaveLength(2)
    expect(callsTo(SESSION_URL)).toHaveLength(2)

    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.AccessNotConfirmed)
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  // The no-loop guarantee has to survive the reload it uses as its remedy.
  // The previous test mocks the navigation, so the once-per-page guard
  // survives there; in a browser the navigation erases it.
  it('should not hand the page over a second time for a condition the handover does not fix', async () => {
    apiAnswers = [REFUSED, REFUSED]

    await exhausted(axios.post(API_URL, {}))
    await flushPromises()

    expect(reloadMock).toHaveBeenCalledTimes(1)

    // The reload as the browser performs it: a fresh Pinia, but
    // `sessionStorage` is not reset because a navigation does not reset it.
    setActivePinia(createPinia())
    sent.length = 0
    reloadMock.mockClear()

    // CF Access is satisfied and answers the reload with the same refusal.
    apiAnswers = [REFUSED, REFUSED]

    await exhausted(axios.post(API_URL, {}), IdentityRefusal.SignInDidNotHelp)
    await flushPromises()

    expect(reloadMock).not.toHaveBeenCalled()
    // The refusal survives the exhaustion: it is what the notice shows.
    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.SignInDidNotHelp)

    expect(callsTo(API_URL)).toHaveLength(2)
    expect(callsTo(SESSION_URL)).toHaveLength(2)
  })

  it('should give a later expiry its own handover once the path is working again', async () => {
    // One handover on record ...
    apiAnswers = [REFUSED, REFUSED]
    await exhausted(axios.post(API_URL, {}))
    await flushPromises()
    expect(reloadMock).toHaveBeenCalledTimes(1)

    // ... then a protected request that worked, which settles the handover.
    setActivePinia(createPinia())
    sent.length = 0
    reloadMock.mockClear()
    await axios.post(API_URL, {})

    // An ordinary expiry later must not inherit the earlier attempt.
    setActivePinia(createPinia())
    apiAnswers = [REFUSED, REFUSED]
    await exhausted(axios.post(API_URL, {}))
    await flushPromises()

    expect(reloadMock).toHaveBeenCalledTimes(1)
    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.AccessNotConfirmed)
  })

  it('should bootstrap once for a burst of requests refused together', async () => {
    apiAnswers = [REFUSED, REFUSED, REFUSED, REFUSED]

    await Promise.all([
      axios.post(API_URL, {}),
      axios.post(API_URL, {}),
      axios.post(API_URL, {}),
      axios.post(API_URL, {}),
    ])

    // One bootstrap to open the session, one to answer the whole burst.
    expect(callsTo(SESSION_URL)).toHaveLength(2)
    expect(callsTo(API_URL)).toHaveLength(8)
  })

  // An expired provider session is a cross-origin redirect a script cannot
  // read: axios reports ERR_NETWORK, indistinguishable from a dropped
  // connection. The probe settles it, and the provider's challenge is
  // followed at once (Q42), to the page the operator is on.
  it('should go straight to the provider when the answer is not ours and the probe confirms the challenge', async () => {
    apiAnswers = [NOT_OURS]
    probeAnswers = [PROBE_CHALLENGE]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(SESSION_URL)
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ redirect: 'manual', credentials: 'include' })
    expect(reloadMock).toHaveBeenCalledTimes(1)
    expect(useIdentityStore().refusal).toBeNull()

    // And no bootstrap in answer to it: an XHR to our own edge would be
    // intercepted the very same way.
    expect(callsTo(SESSION_URL)).toHaveLength(1)
    expect(callsTo(API_URL)).toHaveLength(1)
  })

  it('should explain no connection with a retry, without taking the page, when the probe fell through too', async () => {
    apiAnswers = [NOT_OURS]
    probeAnswers = [PROBE_OFFLINE]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()

    expect(reloadMock).not.toHaveBeenCalled()
    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.RegistryUnavailable)
    expect(callsTo(SESSION_URL)).toHaveLength(1)
  })

  // The activity ping fires while the operator is typing. There is no
  // dirty-form guard in this app, so the provider's challenge is followed
  // from a ping as from any request (Q42); what a ping must never do is
  // move the page on a failure the probe did not confirm.
  it('should not take the page away from a typing operator for a ping the probe could not blame on the provider', async () => {
    apiAnswers = [NOT_OURS]
    probeAnswers = [200]

    await expect(axios.post(PING_URL, {})).rejects.toThrow()
    await flushPromises()

    expect(reloadMock).not.toHaveBeenCalled()
    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.ProviderSignInNeeded)
  })

  // The request is over either way, and a burst of them must not hold the
  // page (or the router guard behind the first protected call) for as long
  // as the probe may take.
  it('should settle the refused request without waiting for the probe', async () => {
    let answer: (verdict: unknown) => void = () => {}

    fetchMock.mockReturnValueOnce(new Promise(resolve => {
      answer = resolve
    }) as any)
    apiAnswers = [NOT_OURS]

    await expect(axios.post(API_URL, {})).rejects.toThrow()

    // Still probing: nothing decided, nothing navigated.
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(reloadMock).not.toHaveBeenCalled()

    answer({ type: 'opaqueredirect', status: 0 })
    await flushPromises()

    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('should probe once and go once for a burst of answers that are not ours', async () => {
    apiAnswers = [NOT_OURS, NOT_OURS, NOT_OURS, NOT_OURS]
    probeAnswers = [PROBE_CHALLENGE]

    await Promise.allSettled([
      axios.post(API_URL, {}),
      axios.post(API_URL, {}),
      axios.post(API_URL, {}),
      axios.post(API_URL, {}),
    ])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  // The navigation erases the store; the handoff marker is what says the
  // provider was already tried, and a second challenge straight after
  // coming back is a loop the operator is told about, not repeated.
  it('should stop with "signing in did not help" on a second challenge right after returning from the provider', async () => {
    apiAnswers = [NOT_OURS]
    probeAnswers = [PROBE_CHALLENGE]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()
    expect(reloadMock).toHaveBeenCalledTimes(1)

    // Back from the provider: a fresh Pinia, sessionStorage carried across.
    setActivePinia(createPinia())
    sent.length = 0
    reloadMock.mockClear()
    apiAnswers = [NOT_OURS]
    probeAnswers = [PROBE_CHALLENGE]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()

    expect(reloadMock).not.toHaveBeenCalled()
    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.SignInDidNotHelp)
  })

  it('should never retry the bootstrap itself', async () => {
    sessionAnswers = [401]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()

    // A refused bootstrap asking the bootstrap to fix it is the one loop
    // this cannot have.
    expect(callsTo(SESSION_URL)).toHaveLength(1)
    expect(callsTo(API_URL)).toHaveLength(0)
    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.AccessNotConfirmed)
    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  it('should explain an unreachable registry without sending the operator anywhere', async () => {
    sessionAnswers = [503]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()

    const store = useIdentityStore()

    expect(store.refusal?.code).toBe(IdentityRefusal.RegistryUnavailable)
    expect(reloadMock).not.toHaveBeenCalled()

    // And it stops asking: the next request is refused before it is sent.
    await expect(axios.post(API_URL, {})).rejects.toThrow()
    expect(callsTo(SESSION_URL)).toHaveLength(1)
    expect(callsTo(API_URL)).toHaveLength(0)
  })

  it('should explain a blocked operator without sending them anywhere', async () => {
    sessionAnswers = [403]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()

    expect(useIdentityStore().refusal?.code).toBe(IdentityRefusal.AccessNotGranted)
    expect(reloadMock).not.toHaveBeenCalled()
  })

  // When the edge does not proxy `/api/auth/session` to the issuer, the
  // backoffice answers 404. Calling that an outage would put a "try again"
  // button on screen that can never succeed.
  it('should tell a session route that is not deployed apart from an outage', async () => {
    sessionAnswers = [404]

    await expect(axios.post(API_URL, {})).rejects.toThrow()
    await flushPromises()

    const { refusal } = useIdentityStore()

    expect(refusal?.code).toBe(IdentityRefusal.SessionNotConfigured)
    expect(refusal?.status).toBe(404)
    expect(reloadMock).not.toHaveBeenCalled()
  })

  // `ApiService.showError` raises no toast for a plain Error: the panel
  // stays empty and nothing is said.
  it('should refuse in a shape the vendored error layer can render', async () => {
    sessionAnswers = [403]

    const thrown: any = await axios.post(API_URL, {}).catch(error => error)

    expect(thrown.type).toBe(IDENTITY_REFUSED_TYPE)
    expect(thrown.code).toBe(IdentityRefusal.AccessNotGranted)

    // And not one of the four types the vendored layer reads as "the
    // session died", which would push the operator to the password screen.
    expect(['UNAUTHORIZED', 'BAD_CREDENTIALS', 'TOKEN_EXPIRED', 'TOKEN_INVALID']).not.toContain(thrown.type)
  })
})
