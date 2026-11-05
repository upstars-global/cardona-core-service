/*
 * The router-guard side of the cookie session, kept out of any one project's
 * guard so every backoffice asks the same questions. A project's guard still
 * decides what a signed-in operator sees (menus, products); these only say
 * whether there is one.
 */
import { isSessionBootstrapEnabled } from '../configs/identity'
import { useIdentityStore } from '../stores/identity'
import { checkIsLoggedIn } from './token-auth'

/*
 * `checkIsLoggedIn()` asks localStorage for the legacy access/refresh pair.
 * A session opened at the provider stores nothing there (the credential is
 * an HttpOnly cookie), so on a bootstrap build the legacy answer is always
 * "no" and the guard would hand an authenticated operator the password form.
 */
export const isSignedIn = (): boolean => {
  if (checkIsLoggedIn())
    return true

  if (!isSessionBootstrapEnabled())
    return false

  const identity = useIdentityStore()

  // A refusal recorded after the session was established ends it: the
  // protected route closes behind it, see `holdsWithoutSession`.
  return identity.isEstablished && !identity.refusal
}

/*
 * Where an operator without a session goes on a build that drives one:
 * nowhere. The Login route is the password form, and on this build the
 * provider is the only way in, so sending a refused operator there would
 * offer the very sign-in the session replaced. It would also move the page:
 * the notice's "Continue to sign in" reloads whatever the address bar says,
 * and the provider hands the operator back to that address, so Login is
 * where they would land after signing in.
 *
 * Any navigation reaches this, not only one the operator starts: a list
 * page writes its pagination into the query, and the first push after a
 * background request was refused used to be what carried the page to
 * Login. Holding keeps the operator on the page they were on, under the
 * notice; on the first navigation of a page the address stays as typed.
 */
export const holdsWithoutSession = (): boolean =>
  isSessionBootstrapEnabled() && !isSignedIn()

/*
 * Open the session before the guard decides anything. The guard's own
 * `fetchCurrentUser()` is the first protected call, and a throw inside
 * `beforeEach` becomes a blank page rather than a refusal notice.
 * `ensureSession` is single-flight, and a refusal is terminal until the
 * operator acts on it.
 */
export const openSessionIfThisBuildDrivesOne = async (): Promise<void> => {
  if (!isSessionBootstrapEnabled() || checkIsLoggedIn())
    return

  const identity = useIdentityStore()

  if (identity.isEstablished || identity.refusal)
    return

  await identity.ensureSession()
}
