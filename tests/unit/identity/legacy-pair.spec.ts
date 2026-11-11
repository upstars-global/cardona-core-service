/*
 * On a session build the password-era pair keeps the operator on the legacy
 * credential: the guard counts it as signed in and opens no session, and the
 * vendored interceptor refreshes it before every request, which the
 * backoffice refuses once the legacy sign-in is off for Cardona. So every
 * pair is emptied, live or dead.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkIsLoggedIn } from '../../../src/helpers/token-auth'
import { dropLegacyPair } from '../../../src/libs/identity/legacy-pair'

const clearAuthMock = vi.hoisted(() => vi.fn())
const fetchCurrentUserMock = vi.hoisted(() => vi.fn(async () => undefined))

vi.mock('vue-router', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('../../../src/stores/authCore', () => ({ useAuthCoreStore: () => ({ clearAuth: clearAuthMock }) }))
vi.mock('../../../src/stores/user', () => ({ useUserStore: () => ({ fetchCurrentUser: fetchCurrentUserMock }) }))
vi.mock('../../../src/helpers/toasts', () => ({ default: () => ({ toastError: vi.fn() }) }))

const KEY = 'auth-tokens-production'
const nowSeconds = Math.floor(Date.UTC(2026, 9, 16, 12, 0, 0) / 1000)
const EMPTY = { accessToken: '', refreshToken: '' }

const b64url = (value: object) =>
  btoa(JSON.stringify(value)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

const jwt = (payload: object) => `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.signature`

const storePair = (refreshToken: unknown, key = KEY, accessToken: unknown = jwt({ exp: nowSeconds - 60 })) =>
  localStorage.setItem(key, JSON.stringify({ accessToken, refreshToken }))

const pairOf = (key = KEY) => JSON.parse(localStorage.getItem(key) as string)

describe('dropLegacyPair', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should empty a live pair, so the guard opens a session instead of using it', () => {
    storePair(jwt({ username: 'a', exp: nowSeconds + 3600 }), KEY, jwt({ exp: nowSeconds + 300 }))

    expect(checkIsLoggedIn()).toBe(true)

    dropLegacyPair()

    expect(pairOf()).toEqual(EMPTY)
    expect(checkIsLoggedIn()).toBe(false)
  })

  it('should empty a pair whose refresh token has expired', () => {
    storePair(jwt({ username: 'a', exp: nowSeconds - 1 }))

    dropLegacyPair()

    expect(pairOf()).toEqual(EMPTY)
  })

  it('should empty a pair whose refresh token cannot be read', () => {
    storePair('not-a-jwt')

    dropLegacyPair()

    expect(pairOf()).toEqual(EMPTY)
  })

  it('should empty a pair that carries only an access token', () => {
    storePair('')

    dropLegacyPair()

    expect(pairOf()).toEqual(EMPTY)
  })

  // An empty pair is already no pair: rewriting it would only wake every
  // other open tab's storage listener for nothing.
  it('should leave an already empty pair untouched', () => {
    localStorage.setItem(KEY, JSON.stringify(EMPTY))

    const before = localStorage.getItem(KEY)
    const setItem = vi.spyOn(Storage.prototype, 'setItem')

    dropLegacyPair()

    expect(localStorage.getItem(KEY)).toBe(before)
    expect(setItem).not.toHaveBeenCalled()

    setItem.mockRestore()
  })

  it('should empty every pair key, not only the first', () => {
    storePair(jwt({ username: 'a', exp: nowSeconds + 3600 }), 'auth-tokens-development')
    storePair(jwt({ username: 'a', exp: nowSeconds - 1 }))

    dropLegacyPair()

    expect(pairOf('auth-tokens-development')).toEqual(EMPTY)
    expect(pairOf()).toEqual(EMPTY)
  })

  it('should leave everything else in storage alone', () => {
    localStorage.setItem('selectedProjectId', '1')

    dropLegacyPair()

    expect(localStorage.getItem('selectedProjectId')).toBe('1')
  })

  it('should leave a pair that is not JSON in place rather than throw', () => {
    localStorage.setItem(KEY, '{broken')

    expect(() => dropLegacyPair()).not.toThrow()
    expect(localStorage.getItem(KEY)).toBe('{broken')
  })

  // Another open tab hears the change through the core's listener, which
  // reads a removed key as a broken token: error toast, clearAuth, Login.
  it('should not throw another open tab out when it hears the change', async () => {
    const { useCheckToken } = await import('../../../src/use/useCheckToken')

    useCheckToken()
    storePair(jwt({ username: 'a', exp: nowSeconds + 3600 }))

    dropLegacyPair()
    window.dispatchEvent(new StorageEvent('storage', { key: KEY, newValue: localStorage.getItem(KEY) }))
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(clearAuthMock).not.toHaveBeenCalled()
  })
})
