/*
 * The password-era access/refresh pair left in localStorage on a build that
 * drives the session itself.
 *
 * The edge ignores its Authorization while the session cookie is there, so
 * the pair does no harm while it lives; it is also what lets an operator keep
 * working without a password if the session flag is switched off again. Once
 * its refresh token has expired it is neither: the vendored interceptor
 * still tries to refresh it before every request, the backoffice answers
 * ACCESS_DENIED, which nothing treats as the end of a session, and the pair
 * stays forever. So only a dead pair goes.
 *
 * "Dead" is the backoffice's own rule (SignatureService::read): `exp`, read
 * before the signature, absent counting as zero. Keys are found the way the
 * core's `checkIsLoggedIn` finds them, and synchronously, so the pair is gone
 * before the router guard asks whether anyone is signed in.
 *
 * Emptied, not removed: every other open tab hears the change through the
 * core's `useCheckToken`, which reads a removed key as a broken token and
 * sends that tab to Login with an error. An empty pair still parses there,
 * and here it is no pair at all: the interceptor refreshes nothing without
 * a refresh token, and `checkIsLoggedIn` wants both.
 */
const isExpired = (token: unknown, nowSeconds: number): boolean => {
  try {
    const payload = JSON.parse(atob(String(token).split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))

    return (Number(payload?.exp) || 0) < nowSeconds
  }
  catch {
    return true
  }
}

export const dropDeadLegacyPair = (now: number = Date.now()): void => {
  try {
    const nowSeconds = Math.floor(now / 1000)

    for (const key of Object.keys(localStorage).filter(item => item.startsWith('auth-tokens-'))) {
      try {
        const raw = localStorage.getItem(key)
        const refreshToken = raw ? JSON.parse(raw)?.refreshToken : undefined

        if (refreshToken && isExpired(refreshToken, nowSeconds))
          localStorage.setItem(key, JSON.stringify({ accessToken: '', refreshToken: '' }))
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
