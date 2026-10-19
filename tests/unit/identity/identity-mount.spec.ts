/*
 * A build with the branch off must register nothing: a check inside a
 * handler would still leave the handler on the shared axios instance and
 * the store instantiated behind it.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import axios from '../../../src/libs/axios'

const installIdentity = (await import('../../../src/libs/identity/interceptors')).default

const registered = () => ({
  request: (axios.interceptors.request as any).handlers.filter(Boolean).length,
  response: (axios.interceptors.response as any).handlers.filter(Boolean).length,
})

describe('identity plugin registration', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should register nothing at all while the bootstrap branch is off', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')

    const before = registered()

    installIdentity()

    expect(registered()).toEqual(before)
  })

  it('should register exactly one request and one response handler once the branch is on', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')

    const before = registered()

    installIdentity()

    // Exactly one pair, so that "one retry" stays a property of the code
    // rather than of how many times something was installed.
    expect(registered()).toEqual({ request: before.request + 1, response: before.response + 1 })
  })

  // A dead password-era pair would otherwise be refreshed before every
  // request; only a session build has a session to fall back on.
  it('should drop a dead legacy pair on a session build only', () => {
    const deadPair = JSON.stringify({ accessToken: 'a.e30.s', refreshToken: 'a.e30.s' })

    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')
    localStorage.setItem('auth-tokens-production', deadPair)
    installIdentity()
    expect(localStorage.getItem('auth-tokens-production')).toBe(deadPair)

    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')
    installIdentity()
    expect(JSON.parse(localStorage.getItem('auth-tokens-production') as string).refreshToken).toBe('')
  })
})
