/*
 * One switch for the SPA and the edge: the value the container wrote into
 * index.html on start (window.IAM_SESSION) decides, in both directions, over
 * the build default. Only where the page carries no runtime value (the dev
 * server, tests, the marker's empty placeholder) does the build default apply.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cfAccessSignOutUrl, isSessionBootstrapEnabled } from '../../../src/configs/identity'

describe('isSessionBootstrapEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    delete window.IAM_SESSION
  })

  it('should turn the session on from the runtime switch over an off build default', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')
    window.IAM_SESSION = 'true'

    expect(isSessionBootstrapEnabled()).toBe(true)
  })

  it('should turn the session off from the runtime switch over an on build default', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')
    window.IAM_SESSION = 'false'

    expect(isSessionBootstrapEnabled()).toBe(false)
  })

  it('should fall back to an on build default without a runtime switch', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')

    expect(isSessionBootstrapEnabled()).toBe(true)
  })

  it('should fall back to an off build default without a runtime switch', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', '')

    expect(isSessionBootstrapEnabled()).toBe(false)
  })

  it('should treat the unrewritten placeholder as no runtime switch', () => {
    vi.stubEnv('VITE_IAM_SESSION_BOOTSTRAP', 'true')
    window.IAM_SESSION = ''

    expect(isSessionBootstrapEnabled()).toBe(true)
  })
})

/*
 * Signing out has to clear two cookies, the host's and the team's. The bare
 * logout of this host does both and ends on the provider's sign-in for this
 * host; any query on it (a `returnTo`) ends on a CF error page instead.
 */
describe('cfAccessSignOutUrl', () => {
  const location = window.location

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: location, writable: true })
  })

  it('should be the bare logout of this host, with no query', () => {
    Object.defineProperty(window, 'location', { value: { ...location, origin: 'https://backoffice.example.com' }, writable: true })

    expect(cfAccessSignOutUrl()).toBe('https://backoffice.example.com/cdn-cgi/access/logout')
  })
})
