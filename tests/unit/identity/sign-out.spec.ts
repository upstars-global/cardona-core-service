/*
 * Signing out of a cookie session (BAC-8742). The edge expires the HttpOnly
 * cookie, the page forgets everything that would bring the session back,
 * and this host's provider logout is where the operator goes, whatever the
 * edge answered; the provider's sign-in for this host is where they land.
 */
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetStatePlugin } from '../../../src/stores/plugins/resetStatePlugin'
import { hasRecentHandoff, rememberHandoff } from '../../../src/libs/identity/identity-handoff'
import { useIdentityStore } from '../../../src/stores/identity'
import { signOutOfSession } from '../../../src/libs/identity/sign-out'

const endSessionMock = vi.hoisted(() => vi.fn())
const requestSessionMock = vi.hoisted(() => vi.fn())
const disconnectSessionMock = vi.hoisted(() => vi.fn())
const clearAuthTokensMock = vi.hoisted(() => vi.fn())

vi.mock('../../../src/libs/identity/session-bootstrap', () => ({
  endSession: endSessionMock,
  requestSession: requestSessionMock,
  refusalFromError: () => ({ code: 'unknown', requestId: '' }),
  requestIdOf: () => '',
}))

vi.mock('../../../src/libs/identity/realtime-connection', () => ({
  disconnectSession: disconnectSessionMock,
}))

vi.mock('axios-jwt', () => ({
  clearAuthTokens: clearAuthTokensMock,
}))

// jsdom refuses to navigate; the provider's logout is a full navigation.
const assignMock = vi.fn()
const reloadMock = vi.fn()

Object.defineProperty(window, 'location', {
  value: { ...window.location, assign: assignMock, reload: reloadMock },
  writable: true,
})

// This host's own logout, bare: CF clears both of its cookies from there
// and returns to its sign-in for this host (measured 2026-10-11).
const CF_SIGN_OUT = `${window.location.origin}/cdn-cgi/access/logout`

describe('signing out of a cookie session', () => {
  beforeEach(() => {
    sessionStorage.clear()
    // With the app's reset plugin: the vendored logout resets every store.
    // A plugin applies only once Pinia is installed in an app.
    const pinia = createPinia().use(resetStatePlugin)

    createApp({}).use(pinia)
    setActivePinia(pinia)
    vi.resetAllMocks()
    endSessionMock.mockResolvedValue(undefined)
    clearAuthTokensMock.mockResolvedValue(undefined)
    requestSessionMock.mockResolvedValue({ provisioned: false, requestId: '' })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should ask the edge to expire the session cookie', async () => {
    await signOutOfSession()

    expect(endSessionMock).toHaveBeenCalledTimes(1)
  })

  it('should clear the legacy token pair', async () => {
    await signOutOfSession()

    expect(clearAuthTokensMock).toHaveBeenCalledTimes(1)
  })

  it('should forget the handoff marker so the next sign-in is not read as a failed one', async () => {
    rememberHandoff()

    await signOutOfSession()

    expect(hasRecentHandoff()).toBe(false)
  })

  it('should stop the notification socket', async () => {
    await signOutOfSession()

    expect(disconnectSessionMock).toHaveBeenCalledTimes(1)
  })

  it('should go to the logout of this host, bare, with no query', async () => {
    await signOutOfSession()

    expect(assignMock).toHaveBeenCalledTimes(1)
    expect(assignMock).toHaveBeenCalledWith(CF_SIGN_OUT)
    expect(assignMock.mock.calls[0][0]).not.toContain('?')
  })

  it('should go to the provider logout even when the edge did not answer', async () => {
    endSessionMock.mockRejectedValue(new Error('Network Error'))
    rememberHandoff()

    await signOutOfSession()

    expect(clearAuthTokensMock).toHaveBeenCalledTimes(1)
    expect(hasRecentHandoff()).toBe(false)
    expect(disconnectSessionMock).toHaveBeenCalledTimes(1)
    expect(assignMock).toHaveBeenCalledWith(CF_SIGN_OUT)
  })

  // The vendored logout pushes to Login straight after; the guard there
  // must not be granted a fresh cookie from the still-valid provider session.
  it('should open no new session while leaving, even after the stores are reset', async () => {
    const identity = useIdentityStore()

    expect(await identity.ensureSession()).toBe(true)
    requestSessionMock.mockClear()

    const leaving = signOutOfSession()

    identity.$reset()

    expect(await identity.ensureSession()).toBe(false)
    expect(await identity.retry()).toBe(false)
    expect(requestSessionMock).not.toHaveBeenCalled()

    await leaving
  })

  it('should expire the cookie only after a bootstrap already on its way has landed', async () => {
    let grant: (value: unknown) => void = () => {}

    requestSessionMock.mockReturnValue(new Promise(resolve => {
      grant = resolve
    }))

    const opening = useIdentityStore().ensureSession()
    const leaving = signOutOfSession()

    await Promise.resolve()
    expect(endSessionMock).not.toHaveBeenCalled()

    grant({ provisioned: false, requestId: '' })
    await opening
    await leaving

    expect(endSessionMock).toHaveBeenCalledTimes(1)
    expect(assignMock).toHaveBeenCalledWith(CF_SIGN_OUT)
  })

  it('should not hand the page to the provider sign-in on a refusal while leaving', async () => {
    const leaving = signOutOfSession()

    useIdentityStore().challenge('req-1')
    useIdentityStore().goToProvider()

    await leaving

    expect(reloadMock).not.toHaveBeenCalled()
    expect(assignMock).toHaveBeenCalledTimes(1)
  })

  it('should sign out once when the menu and its store hook both ask', async () => {
    await Promise.all([signOutOfSession(), signOutOfSession()])

    expect(endSessionMock).toHaveBeenCalledTimes(1)
    expect(assignMock).toHaveBeenCalledTimes(1)
  })
})
