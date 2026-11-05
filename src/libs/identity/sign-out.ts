/*
 * Signing out of a cookie session.
 *
 * Clearing the legacy pair is not enough on a build that drives the session
 * itself: the CF Access session lives for a day, so the next navigation
 * would be granted a fresh cookie and the operator would be back in, and
 * the cookie already held is HttpOnly and scoped to /api, out of the page's
 * reach. So the edge expires the cookie, and the provider ends its own
 * sessions, the host's and the team's, with a navigation to this host's
 * logout (see `cfAccessSignOutUrl`); its login screen for this host is
 * where the operator lands.
 *
 * Every step before the navigation is best effort. Staying signed in because
 * a request failed would be the one wrong outcome.
 */
import { clearAuthTokens } from 'axios-jwt'
import { cfAccessSignOutUrl } from '../../configs/identity'
import { forgetHandoff } from './identity-handoff'
import { disconnectSession } from './realtime-connection'
import { endSession } from './session-bootstrap'
import { useIdentityStore } from '../../stores/identity'

let leaving: Promise<void> | null = null

const leave = async (): Promise<void> => {
  // First and synchronously: the vendored logout routes to Login right after
  // calling us, and that navigation must not open a new session.
  const settled = useIdentityStore().leave()

  disconnectSession()

  try {
    await settled
    await endSession()
  }
  catch {
    // The edge did not answer; the provider's logout still ends the session
    // that would mint a new cookie, and the old one has seconds to live.
  }

  try {
    await clearAuthTokens()
  }
  catch {
    // Storage denied; there is no pair to clear then either.
  }

  // Last, so nothing above can set it again. Left behind, it would make the
  // first refusal after signing back in read as "signing in did not help".
  forgetHandoff()

  window.location.assign(cfAccessSignOutUrl())
}

/*
 * Once per page: the menu's logout and the store hook that catches it can
 * both arrive here, and the page is leaving anyway.
 */
export const signOutOfSession = (): Promise<void> => {
  if (!leaving) {
    leaving = leave().finally(() => {
      // Only a test ever sees this page again.
      leaving = null
    })
  }

  return leaving
}
