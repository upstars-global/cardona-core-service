// The transport is mocked wholesale by the store's spec, so what it
// promises is covered here or nowhere.
import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IdentityRefusal } from '../../../src/@model/identity'

const sent: any[] = []

// What the issuer answers with; empty for an ordinary grant.
let answer: any = {}

axios.defaults.adapter = vi.fn(async (config: any) => {
  sent.push(config)

  return { data: answer, status: 200, statusText: 'OK', headers: { 'x-request-id': 'hdr-1' }, config, request: {} }
})

// The existing way in keeps `Authorization` on the shared defaults, and
// `axios.create()` copies them. Seeded before the module is imported so the
// assertion below is about a header genuinely there to be inherited.
axios.defaults.headers.common.Authorization = 'Bearer vendored-token'

const createSpy = vi.spyOn(axios, 'create')

const { SessionProbe, endSession, probeSession, refusalFromError, requestIdOf, requestSession } = await import('../../../src/libs/identity/session-bootstrap')

describe('session bootstrap transport', () => {
  beforeEach(() => {
    sent.length = 0
    answer = {}
  })


  it('should create no client merely by being imported', () => {
    // A build with the branch off imports this module and must not
    // construct an axios instance because of it.
    expect(createSpy).not.toHaveBeenCalled()
  })

  it('should ask the session route once, on a client of its own, and reuse it', async () => {
    await requestSession()
    await requestSession()

    expect(sent.map(config => config.url)).toEqual(['/api/auth/session', '/api/auth/session'])

    // One client for the life of the page: a second `axios.create()` would
    // be a second chance to inherit whatever the shared defaults hold.
    expect(createSpy).toHaveBeenCalledTimes(1)

    // Interceptor-free: the shared instance carries the retry that calls
    // this function.
    expect((createSpy.mock.results[0].value as any).interceptors.request.handlers.filter(Boolean)).toHaveLength(0)
  })

  it('should bound the wait so nothing queues behind a slow issuer forever', async () => {
    await requestSession()

    expect(sent[0].timeout).toBe(10_000)
  })

  it('should end the session with a POST to the edge, with no credential and a short wait', async () => {
    await endSession()

    expect(sent).toHaveLength(1)
    expect(sent[0].method).toBe('post')
    expect(sent[0].url).toBe('/api/auth/logout')
    expect(sent[0].headers.Authorization).toBeUndefined()
    expect(sent[0].timeout).toBeGreaterThan(0)
    expect(sent[0].timeout).toBeLessThanOrEqual(3_000)
  })

  it('should carry no credential to the request that asks for one', async () => {
    await requestSession()

    // This is the call that earns the cookie; the client inherits
    // `Authorization` from `axios.defaults` unless it is taken off.
    expect(sent[0].headers.Authorization).toBeFalsy()
  })

  describe('the reference an operator can quote', () => {
    it('should prefer the one in the body, which every party in this path puts there', () => {
      expect(requestIdOf({ data: { requestId: 'from-body' }, headers: { 'x-request-id': 'from-header' } })).toBe('from-body')
    })

    it('should fall back to the header the issuer repeats it in', () => {
      expect(requestIdOf({ data: {}, headers: { 'x-request-id': 'from-header' } })).toBe('from-header')
    })

    it('should be empty rather than undefined when there is nothing to quote', () => {
      expect(requestIdOf(undefined)).toBe('')
      expect(requestIdOf({})).toBe('')
    })
  })

  describe('the refusal a failed bootstrap stands for', () => {
    const errorWith = (status?: number) => ({ response: { status, data: { requestId: 'req-1' }, headers: {} } })

    it('should keep the status, because one refusal needs it to say anything useful', () => {
      expect(refusalFromError(errorWith(404))).toEqual({
        code: IdentityRefusal.SessionNotConfigured,
        requestId: 'req-1',
        status: 404,
      })
    })

    it('should read an answer that never arrived as an unreachable registry, not a missing route', () => {
      // A timeout has no response at all. Calling that a deployment
      // fault would send an operator chasing the wrong people.
      expect(refusalFromError({ code: 'ECONNABORTED' }).code).toBe(IdentityRefusal.RegistryUnavailable)
    })

    it('should map the statuses the issuer and the gateway actually answer with', () => {
      expect(refusalFromError(errorWith(401)).code).toBe(IdentityRefusal.AccessNotConfirmed)
      expect(refusalFromError(errorWith(403)).code).toBe(IdentityRefusal.AccessNotGranted)
      expect(refusalFromError(errorWith(503)).code).toBe(IdentityRefusal.RegistryUnavailable)
      // The edge's rate limit on the session route: retryable, not "not set up".
      expect(refusalFromError(errorWith(429)).code).toBe(IdentityRefusal.RegistryUnavailable)
    })
  })

  // ADR-026: an ordinary grant says nothing; a provisioning grant says the
  // account was just created, with the reference to quote.
  describe('what a grant says', () => {
    it('should read an empty body as an ordinary grant', async () => {
      expect(await requestSession()).toEqual({ provisioned: false, requestId: 'hdr-1' })
    })

    it('should read the provisioning mark and the reference off the body', async () => {
      answer = { provisioned: true, requestId: 'req-9' }

      expect(await requestSession()).toEqual({ provisioned: true, requestId: 'req-9' })
    })

    it('should not take anything but the literal boolean as the mark', async () => {
      answer = { provisioned: 'true' }

      expect((await requestSession()).provisioned).toBe(false)
    })
  })
})

/*
 * The probe: `fetch` with `redirect: 'manual'`, bounded by the same patience
 * as the bootstrap, and cut off rather than left running when it is up.
 */
describe('session probe', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('should read the provider redirect as its challenge', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ type: 'opaqueredirect', status: 0 })))

    expect(await probeSession()).toBe(SessionProbe.Challenge)
  })

  it('should ask without following redirects and with the cookie', async () => {
    const fetchMock = vi.fn(async () => ({ type: 'basic', status: 200 }))

    vi.stubGlobal('fetch', fetchMock)

    expect(await probeSession()).toBe(200)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/session')
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ redirect: 'manual', credentials: 'include' })
  })

  it('should read a dropped connection as offline', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }))

    expect(await probeSession()).toBe(SessionProbe.Offline)
  })

  it('should abort a probe that outlives its patience and read it as offline', async () => {
    vi.useFakeTimers()

    let signal: AbortSignal | undefined

    // A fetch that answers only when told to stop, as a real one does.
    vi.stubGlobal('fetch', vi.fn((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
      signal = init.signal as AbortSignal
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })))

    const probing = probeSession()

    await vi.advanceTimersByTimeAsync(10_000)

    expect(signal?.aborted).toBe(true)
    expect(await probing).toBe(SessionProbe.Offline)
  })
})
