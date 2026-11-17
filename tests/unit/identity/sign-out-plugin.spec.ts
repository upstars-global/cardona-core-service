/*
 * The profile menu's Logout is vendored: it calls `authCore/clearAuth` and
 * pushes to Login. On a session build that call becomes the session sign-out;
 * on a legacy build nothing is hooked.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import store from '../../../src/store'

const signOutOfSessionMock = vi.hoisted(() => vi.fn())

vi.mock('../../../src/libs/identity/sign-out', () => ({
  signOutOfSession: signOutOfSessionMock,
}))

const installSignOut = (await import('../../../src/libs/identity/sign-out-hook')).default

const unsubscribers: Array<() => void> = []
const subscribeAction = store.subscribeAction.bind(store)

store.subscribeAction = ((...args: Parameters<typeof store.subscribeAction>) => {
  const unsubscribe = subscribeAction(...args)

  unsubscribers.push(unsubscribe)

  return unsubscribe
}) as typeof store.subscribeAction

describe('sign-out plugin', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    signOutOfSessionMock.mockResolvedValue(undefined)
  })

  afterEach(() => {
    unsubscribers.splice(0).forEach(unsubscribe => unsubscribe())
    vi.unstubAllEnvs()
  })

  it('should turn the vendored logout into the session sign-out on a session build', async () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')

    installSignOut()

    await store.dispatch('authCore/clearAuth')

    expect(signOutOfSessionMock).toHaveBeenCalledTimes(1)
  })

  it('should leave the other auth actions alone', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')

    installSignOut()

    store.dispatch('filtersCore/clearLocalDefaultFilters')

    expect(signOutOfSessionMock).not.toHaveBeenCalled()
  })

  it('should hook nothing on a legacy build', async () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')

    installSignOut()

    await store.dispatch('authCore/clearAuth')

    expect(signOutOfSessionMock).not.toHaveBeenCalled()
  })
})
