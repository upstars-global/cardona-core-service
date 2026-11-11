/*
 * The password-era access/refresh pair left in localStorage on a build that
 * drives the session itself.
 *
 * A live pair keeps the operator on the password credential: the guard
 * counts it as signed in and opens no session, and the vendored interceptor
 * refreshes it before every request. Once the backoffice refuses the legacy
 * credential for Cardona, each of those refreshes is refused and the
 * operator lands on Login. A dead pair is no better: the backoffice answers
 * ACCESS_DENIED, which nothing treats as the end of a session, and the pair
 * stays forever. So on this build every pair goes, live or dead; switching
 * the session flag off again means signing in with the password once.
 *
 * Keys are found the way the core's `checkIsLoggedIn` finds them, and
 * synchronously, so the pair is gone before the router guard asks whether
 * anyone is signed in.
 *
 * Emptied, not removed: every other open tab hears the change through the
 * core's `useCheckToken`, which reads a removed key as a broken token and
 * sends that tab to Login with an error. An empty pair still parses there,
 * and here it is no pair at all: the interceptor refreshes nothing without
 * a refresh token, and `checkIsLoggedIn` wants both.
 */
const EMPTY_PAIR = JSON.stringify({ accessToken: '', refreshToken: '' })

export const dropLegacyPair = (): void => {
  try {
    for (const key of Object.keys(localStorage).filter(item => item.startsWith('auth-tokens-'))) {
      try {
        const raw = localStorage.getItem(key)
        const pair = raw ? JSON.parse(raw) : undefined

        if (pair?.accessToken || pair?.refreshToken)
          localStorage.setItem(key, EMPTY_PAIR)
      }
      catch {
        // Unreadable as JSON: nothing to refresh with, so nothing to empty.
      }
    }
  }
  catch {
    // Storage denied: the session does not depend on it.
  }
}
