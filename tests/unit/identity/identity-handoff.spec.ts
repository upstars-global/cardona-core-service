import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { forgetHandoff, hasRecentHandoff, rememberHandoff } from '../../../src/libs/identity/identity-handoff'

describe('identity handoff marker', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should remember an attempt across everything but the tab closing', () => {
    expect(hasRecentHandoff()).toBe(false)

    rememberHandoff()

    // sessionStorage rather than a variable: the navigation this guards
    // is exactly what erases variables.
    expect(hasRecentHandoff()).toBe(true)
  })

  it('should forget an attempt once something proved the path works', () => {
    rememberHandoff()
    forgetHandoff()

    expect(hasRecentHandoff()).toBe(false)
  })

  it('should let an attempt age out, so the guard is a window and not a wall', () => {
    vi.useFakeTimers()
    rememberHandoff()

    vi.advanceTimersByTime(59_000)
    expect(hasRecentHandoff()).toBe(true)

    // An operator who really did spend a minute signing in gets a
    // further attempt rather than an explanation they cannot act on.
    vi.advanceTimersByTime(2_000)
    expect(hasRecentHandoff()).toBe(false)
  })

  it('should fall back to the old behaviour where storage is denied', () => {
    const denied = () => { throw new Error('storage is disabled') }

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(denied)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denied)
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(denied)

    // Some privacy modes throw on the accessor itself. Losing the guard
    // is acceptable; taking the whole identity path down with it is not.
    expect(() => rememberHandoff()).not.toThrow()
    expect(() => forgetHandoff()).not.toThrow()
    expect(hasRecentHandoff()).toBe(false)

    vi.restoreAllMocks()
  })
})
