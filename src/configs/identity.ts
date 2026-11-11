// IAM_SESSION is written into index.html at container start
// (nginx/iam-session.envsh).
declare global {
  interface Window {
    IAM_SESSION?: string
  }
}

const RUNTIME_SWITCH_VALUES = ['true', 'false']

/*
 * Whether this page drives the session itself. `GET /api/auth/session`
 * only exists on an edge that proxies it to the issuer, and an always-on
 * bootstrap would put a failing request in front of every page load
 * elsewhere. So the page follows the same switch as the edge that served
 * it: the value the container wrote into index.html on start, which a
 * restart changes without a rebuild. Only where that value is absent (the
 * dev server, tests) does the build default decide.
 */
export const isSessionBootstrapEnabled = (): boolean => {
  const runtime = window.IAM_SESSION

  if (runtime && RUNTIME_SWITCH_VALUES.includes(runtime))
    return runtime === 'true'

  return import.meta.env.VITE_IAM_SESSION_BOOTSTRAP === 'true'
}

/*
 * Where signing out goes: this host's own CF Access logout, with no query.
 * Measured on the preview 2026-10-11 against the real application: CF
 * answers it by clearing the host cookie, redirecting through the team
 * domain (which clears the team cookie too) and on to its login for this
 * host, where the operator reads "You successfully logged out" and is asked
 * to sign in. The team-domain logout alone had left the host cookie alive
 * (2026-10-06), and chaining the two through `returnTo` ended on a CF
 * "Failed to log out" page with the cookies nonetheless gone. The bare host
 * logout is the one address that does all of it and lands right.
 */
export const cfAccessSignOutUrl = (): string =>
  `${window.location.origin}/cdn-cgi/access/logout`
