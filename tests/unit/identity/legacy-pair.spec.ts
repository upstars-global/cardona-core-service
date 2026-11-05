/*
 * A password-era pair whose refresh token has expired made the vendored
 * interceptor refresh before every request on a session build, forever:
 * the backoffice answers ACCESS_DENIED and nothing clears the pair. Only a
 * dead pair goes; a live one is what keeps a switched-off session flag
 * working without a password.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkIsLoggedIn } from '../../../src/helpers/token-auth'
import { dropDeadLegacyPair } from '../../../src/libs/identity/legacy-pair'

const clearAuthMock = vi.hoisted(() => vi.fn())
const fetchCurrentUserMock = vi.hoisted(() => vi.fn(async () => undefined))

vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('../../../src/stores/authCore', () => ({ useAuthCoreStore: () => ({ clearAuth: clearAuthMock }) }))
vi.mock('../../../src/stores/user', () => ({ useUserStore: () => ({ fetchCurrentUser: fetchCurrentUserMock }) }))
vi.mock('../../../src/helpers/toasts', () => ({ default: () => ({ toastError: vi.fn() }) }))

const KEY = 'auth-tokens-production'
const NOW = Date.UTC(2026, 9, 16, 12, 0, 0)
const nowSeconds = Math.floor(NOW / 1000)

const b64url = (value: object) =>
  btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

const jwt = (payload: object) => `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.signature`

const storePair = (refreshToken: unknown, key = KEY) =>
  localStorage.setItem(key, JSON.stringify({ accessToken: jwt({ exp: nowSeconds - 60 }), refreshToken }))

const refreshTokenOf = (key = KEY) => JSON.parse(localStorage.getItem(key) as string).refreshToken

describe('dropDeadLegacyPair', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should empty a pair whose refresh token has expired, so nobody counts it as signed in', () => {
    storePair(jwt({ username: 'a', exp: nowSeconds - 1 }))

    dropDeadLegacyPair(NOW)

    expect(refreshTokenOf()).toBe('')
    expect(checkIsLoggedIn()).toBe(false)
  })

  it('should keep a pair whose refresh token still lives, even with an expired access token', () => {
    const live = jwt({ username: 'a', exp: nowSeconds + 3600 })

    storePair(live)

    dropDeadLegacyPair(NOW)

    expect(refreshTokenOf()).toBe(live)
  })

  it('should empty a pair whose refresh token has no exp, as the backoffice reads it', () => {
    storePair(jwt({ username: 'a' }))

    dropDeadLegacyPair(NOW)

    expect(refreshTokenOf()).toBe('')
  })

  it('should empty a pair whose refresh token cannot be read', () => {
    storePair('not-a-jwt')

    dropDeadLegacyPair(NOW)

    expect(refreshTokenOf()).toBe('')
  })

  // Without a refresh token the interceptor refreshes nothing and nobody
  // counts the pair as signed in, so there is nothing to empty or rewrite.
  it('should leave a pair without a refresh token as it is', () => {
    storePair('')

    const empty = localStorage.getItem(KEY)

    dropDeadLegacyPair(NOW)

    expect(localStorage.getItem(KEY)).toBe(empty)

    storePair(undefined)

    const missing = localStorage.getItem(KEY)

    dropDeadLegacyPair(NOW)

    expect(localStorage.getItem(KEY)).toBe(missing)
  })

  it('should check every pair key, not only the first', () => {
    const live = jwt({ username: 'a', exp: nowSeconds + 3600 })

    storePair(live, 'auth-tokens-development')
    storePair(jwt({ username: 'a', exp: nowSeconds - 1 }))

    dropDeadLegacyPair(NOW)

    expect(refreshTokenOf('auth-tokens-development')).toBe(live)
    expect(refreshTokenOf()).toBe('')
  })

  it('should leave everything else in storage alone', () => {
    localStorage.setItem('selectedProjectId', '1')

    dropDeadLegacyPair(NOW)

    expect(localStorage.getItem('selectedProjectId')).toBe('1')
  })

  it('should leave a pair that is not JSON in place rather than throw', () => {
    localStorage.setItem(KEY, '{broken')

    expect(() => dropDeadLegacyPair(NOW)).not.toThrow()
    expect(localStorage.getItem(KEY)).toBe('{broken')
  })

  // Another open tab hears the change through the core's listener, which
  // reads a removed key as a broken token: error toast, clearAuth, Login.
  it('should not throw another open tab out when it hears the change', async () => {
    const { useCheckToken } = await import('../../../src/use/useCheckToken')

    useCheckToken()
    storePair(jwt({ username: 'a', exp: nowSeconds - 1 }))

    dropDeadLegacyPair(NOW)
    window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: localStorage.getItem(KEY) }))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(clearAuthMock).not.toHaveBeenCalled()
  })
})
