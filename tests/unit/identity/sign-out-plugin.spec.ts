/*
 * The profile menu's Logout is vendored: it calls `authCore.clearAuth()` and
 * pushes to Login. On a session build that call becomes the session sign-out;
 * on a legacy build nothing is hooked.
 */
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthCoreStore } from '../../../src/stores/authCore'

const signOutOfSessionMock = vi.hoisted(() => vi.fn())

vi.mock('../../../src/libs/identity/sign-out', () => ({
  signOutOfSession: signOutOfSessionMock,
}))

const installSignOut = (await import('../../../src/libs/identity/sign-out-hook')).default

describe('sign-out plugin', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
    signOutOfSessionMock.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should turn the vendored logout into the session sign-out on a session build', async () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')

    installSignOut()

    await useAuthCoreStore().clearAuth()

    expect(signOutOfSessionMock).toHaveBeenCalledTimes(1)
  })

  it('should leave the other auth actions alone', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')

    installSignOut()

    useAuthCoreStore().setAuthState(true)

    expect(signOutOfSessionMock).not.toHaveBeenCalled()
  })

  it('should hook nothing on a legacy build', async () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')

    installSignOut()

    await useAuthCoreStore().clearAuth()

    expect(signOutOfSessionMock).not.toHaveBeenCalled()
  })
})
