/*
 * Legacy build (`IAM_SESSION=false`): the vendored Logout is exactly what it
 * was. Nothing here is mocked on the sign-out side: the real hook, the real
 * sign-out chain, and a page whose navigation is watched. The only thing
 * that may not happen is a navigation to any of the provider's logouts.
 */
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthCoreStore } from '../../../src/stores/authCore'

const endSessionMock = vi.hoisted(() => vi.fn())

vi.mock('../../../src/libs/identity/session-bootstrap', () => ({
  endSession: endSessionMock,
  requestSession: vi.fn(),
  probeSession: vi.fn(),
  refusalFromError: () => ({ code: 'unknown', requestId: '' }),
  requestIdOf: () => '',
  SessionProbe: { Challenge: 'challenge', Offline: 'offline' },
}))

vi.mock('../../../src/libs/identity/realtime-connection', () => ({
  disconnectSession: vi.fn(),
}))

const assignMock = vi.fn()

Object.defineProperty(window, 'location', {
  value: { ...window.location, assign: assignMock, reload: vi.fn() },
  writable: true,
})

const installSignOut = (await import('../../../src/libs/identity/sign-out-hook')).default

describe('sign-out on the legacy build', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')
    window.IAM_SESSION = 'false'
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    delete window.IAM_SESSION
  })

  it('should leave the vendored logout alone: no edge call and no provider logout, on either level', async () => {
    installSignOut()

    await useAuthCoreStore().clearAuth()
    await Promise.resolve()

    expect(endSessionMock).not.toHaveBeenCalled()
    expect(assignMock).not.toHaveBeenCalled()
    expect(assignMock.mock.calls.flat().join(' ')).not.toContain('cdn-cgi/access/logout')
  })
})
