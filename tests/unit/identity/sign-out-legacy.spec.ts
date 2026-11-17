/*
 * Legacy build (`IAM_SESSION=false`): the vendored Logout is exactly what it
 * was. Nothing here is mocked on the sign-out side: the real hook, the real
 * sign-out chain, and a page whose navigation is watched. The only thing
 * that may not happen is a navigation to any of the provider's logouts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import store from '../../../src/store'

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

const unsubscribers: Array<() => void> = []
const subscribeAction = store.subscribeAction.bind(store)

store.subscribeAction = ((...args: Parameters<typeof store.subscribeAction>) => {
  const unsubscribe = subscribeAction(...args)

  unsubscribers.push(unsubscribe)

  return unsubscribe
}) as typeof store.subscribeAction

describe('sign-out on the legacy build', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')
    window.IAM_SESSION = 'false'
  })

  afterEach(() => {
    unsubscribers.splice(0).forEach(unsubscribe => unsubscribe())
    vi.unstubAllEnvs()
    delete window.IAM_SESSION
  })

  it('should leave the vendored logout alone: no edge call and no provider logout, on either level', async () => {
    installSignOut()

    await store.dispatch('authCore/clearAuth')
    await Promise.resolve()

    expect(endSessionMock).not.toHaveBeenCalled()
    expect(assignMock).not.toHaveBeenCalled()
    expect(assignMock.mock.calls.flat().join(' ')).not.toContain('cdn-cgi/access/logout')
  })
})
