import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getVersionedStorage, setVersionedStorage } from '../../../src/helpers/storage'

describe('versioned storage', () => {
  const storageKey = 'versioned-storage-test'

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('initializes missing storage through the callback', () => {
    const callback = vi.fn().mockReturnValue({ enabled: true })

    const result = getVersionedStorage({ key: storageKey, callback })

    expect(callback).toHaveBeenCalledWith(null, null, 1)
    expect(result).toEqual({ enabled: true })
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual({
      version: 1,
      data: { enabled: true },
    })
  })

  it('always calls the callback without rewriting data for the current version', () => {
    setVersionedStorage({ key: storageKey, version: 2, data: { enabled: false } })

    const storedData = localStorage.getItem(storageKey)
    const callback = vi.fn().mockReturnValue({ enabled: true })

    const result = getVersionedStorage({ key: storageKey, version: 2, callback })

    expect(callback).toHaveBeenCalledWith({ enabled: false }, 2, 2)
    expect(result).toEqual({ enabled: true })
    expect(localStorage.getItem(storageKey)).toBe(storedData)
  })

  it('migrates legacy data and persists the current version', () => {
    localStorage.setItem(storageKey, JSON.stringify([{ key: 'legacy', active: true }]))

    const callback = vi.fn().mockReturnValue([{ key: 'legacy', active: false }])

    const result = getVersionedStorage({ key: storageKey, version: 2, callback })

    expect(callback).toHaveBeenCalledWith([{ key: 'legacy', active: true }], null, 2)
    expect(result).toEqual([{ key: 'legacy', active: false }])
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual({
      version: 2,
      data: [{ key: 'legacy', active: false }],
    })
  })

  it('migrates data when the stored version is outdated', () => {
    setVersionedStorage({ key: storageKey, data: { enabled: false } })

    const callback = vi.fn().mockReturnValue({ enabled: true })

    getVersionedStorage({ key: storageKey, version: 2, callback })

    expect(callback).toHaveBeenCalledWith({ enabled: false }, 1, 2)
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual({
      version: 2,
      data: { enabled: true },
    })
  })

  it('returns current data without a callback', () => {
    setVersionedStorage({ key: storageKey, data: { enabled: true } })

    expect(getVersionedStorage({ key: storageKey })).toEqual({ enabled: true })
  })

  it('logs an error and ignores incompatible data without a callback', () => {
    setVersionedStorage({ key: storageKey, data: { enabled: true } })

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const result = getVersionedStorage({ key: storageKey, version: 2 })

    expect(result).toBeNull()
    expect(consoleError).toHaveBeenCalledOnce()
    expect(consoleError.mock.calls[0][0]).toBeInstanceOf(Error)
  })

  it('recovers malformed JSON through the callback', () => {
    localStorage.setItem(storageKey, '{')

    const callback = vi.fn().mockReturnValue({ enabled: true })

    const result = getVersionedStorage({ key: storageKey, version: 2, callback })

    expect(callback).toHaveBeenCalledWith(null, null, 2)
    expect(result).toEqual({ enabled: true })
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual({
      version: 2,
      data: { enabled: true },
    })
  })

  it('logs an error when the callback fails during initialization', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const callback = vi.fn(() => {
      throw new Error('Migration failed')
    })

    const result = getVersionedStorage({ key: storageKey, version: 2, callback })

    expect(result).toBeNull()
    expect(consoleError).toHaveBeenCalledOnce()
    expect(localStorage.getItem(storageKey)).toBeNull()
  })
})
