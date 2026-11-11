/*
 * The profile menu's Logout lives in cardona-core-service, a dependency this
 * app does not edit, and does two things: `authCore.clearAuth()` and a push
 * to Login. On a build that drives the session, that push is answered by a
 * new session minted from the provider's still valid one. So the action is
 * caught here and turned into the session sign-out.
 *
 * On such a build nothing else calls `clearAuth()` for a cookie session:
 * the vendored ApiService does so only under the legacy flag, and the
 * token check only on a change to the legacy pair. Either one landing here
 * for an operator who also holds a legacy pair signs out of both, which is
 * what the Login page it was heading for would have undone anyway.
 */
import { useAuthCoreStore } from '../../stores/authCore'
import { isSessionBootstrapEnabled } from '../../configs/identity'
import { signOutOfSession } from './sign-out'

export default function () {
  // The legacy build keeps its Logout exactly as it is.
  if (!isSessionBootstrapEnabled())
    return

  useAuthCoreStore().$onAction(({ name }) => {
    // Before the action body runs, so the session is closed before the
    // menu's push to Login reaches the router guard.
    if (name === 'clearAuth')
      signOutOfSession()
  })
}
