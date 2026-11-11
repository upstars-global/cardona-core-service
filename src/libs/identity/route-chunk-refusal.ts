/*
 * A route whose code is not loaded yet fetches its chunk on the first visit,
 * and on a build that drives a session that request goes through CF Access
 * like any other. Once the provider's session has expired, CF answers it
 * with a cross-origin redirect to its login, the browser refuses to follow
 * it, the dynamic import rejects and vue-router cancels the navigation
 * without a word. No API request is made, so nothing records a refusal and
 * the operator is left clicking a menu that does nothing.
 *
 * The failure is read as "the provider may want you back", the same answer
 * a refused API request gets: the store probes the session route to tell
 * the provider's challenge from a dropped connection, and follows the
 * challenge to the route the operator asked for, so the provider hands them
 * back there rather than to the page they were leaving. A chunk deleted by
 * a new release gets the same navigation, which mends it as well.
 */
import { isSessionBootstrapEnabled } from '../../configs/identity'
import { useIdentityStore } from '../../stores/identity'

// Chrome, Firefox and Safari word a failed dynamic import differently; Vite
// adds its own for a preloaded dependency.
const CHUNK_LOAD_FAILURE = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS/i

export const isChunkLoadFailure = (error: unknown): boolean =>
  CHUNK_LOAD_FAILURE.test(String((error as { message?: string })?.message ?? error ?? ''))

// `target` is the full address of the route that failed to load.
export const refuseOnChunkLoadFailure = (error: unknown, target = ''): void => {
  if (!isSessionBootstrapEnabled() || !isChunkLoadFailure(error))
    return

  const identity = useIdentityStore()

  // A refusal already on record says more than a failed chunk can.
  if (identity.refusal)
    return

  void identity.followProviderChallenge(target)
}
