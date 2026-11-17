/*
 * The one fact about the session that has to survive a page reload.
 *
 * Handing the page to the access provider is a full navigation, which
 * resets every variable the app holds, so "we have already tried this"
 * cannot live in a closure: a condition the navigation does not fix would
 * become an unbounded reload cycle against the rate-limited session route.
 *
 * `sessionStorage`, not `localStorage`: the fact belongs to this tab and
 * this visit. The timestamp keeps the guard from being permanent; what
 * clears the marker is a protected request that actually worked, not a
 * granted session. Every access is wrapped because `sessionStorage` throws
 * outright in some privacy modes.
 */
const HANDOFF_KEY = 'identity.handoff'

const HANDOFF_WINDOW_MS = 60_000

export const rememberHandoff = (): void => {
  try {
    sessionStorage.setItem(HANDOFF_KEY, String(Date.now()))
  }
  catch {
    // Storage denied. The reload still happens; only the guard is lost.
  }
}

export const forgetHandoff = (): void => {
  try {
    sessionStorage.removeItem(HANDOFF_KEY)
  }
  catch {
    // See above.
  }
}

export const hasRecentHandoff = (): boolean => {
  try {
    const at = Number(sessionStorage.getItem(HANDOFF_KEY))

    return Boolean(at) && Date.now() - at < HANDOFF_WINDOW_MS
  }
  catch {
    return false
  }
}
