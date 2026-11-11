/*
 * An expired provider session meets a route whose chunk was never loaded:
 * CF answers the chunk request with a cross-origin redirect, the import
 * rejects and vue-router drops the navigation silently. These tests pin
 * that such a failure is handed to the store's provider challenge on a
 * session build, with the route that failed as the place to return to, and
 * that nothing changes on the password build or for unrelated errors.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IdentityRefusal } from '../../../src/@model/identity'

const followProviderChallenge = vi.hoisted(() => vi.fn(async () => undefined))
const identityState = vi.hoisted(() => ({ refusal: null as unknown }))
const bootstrapEnabled = vi.hoisted(() => ({ value: true }))

vi.mock('../../../src/stores/identity', () => ({ useIdentityStore: () => ({ followProviderChallenge, get refusal() { return identityState.refusal } }) }))
vi.mock('../../../src/configs/identity', () => ({ isSessionBootstrapEnabled: () => bootstrapEnabled.value }))

const { isChunkLoadFailure, refuseOnChunkLoadFailure } = await import('../../../src/libs/identity/route-chunk-refusal')

const chromeFailure = new TypeError('Failed to fetch dynamically imported module: https://x/assets/players.CMUOxO4W.js')

describe('a route chunk that cannot load', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    bootstrapEnabled.value = true
    identityState.refusal = null
  })

  it('recognises the dynamic-import failure of each browser and of Vite preload', () => {
    expect(isChunkLoadFailure(chromeFailure)).toBe(true)
    expect(isChunkLoadFailure(new TypeError('error loading dynamically imported module'))).toBe(true)
    expect(isChunkLoadFailure(new TypeError('Importing a module script failed.'))).toBe(true)
    expect(isChunkLoadFailure(new Error('Unable to preload CSS for /assets/x.css'))).toBe(true)
  })

  // The store decides whether the provider is what failed; this handler
  // only says where the operator was going, so that is where they return.
  it('follows the provider challenge to the route that failed to load', () => {
    refuseOnChunkLoadFailure(chromeFailure, '/p/payouts/requests?page=2')

    expect(followProviderChallenge).toHaveBeenCalledTimes(1)
    expect(followProviderChallenge).toHaveBeenCalledWith('/p/payouts/requests?page=2')
  })

  it('leaves the password build alone', () => {
    bootstrapEnabled.value = false

    refuseOnChunkLoadFailure(chromeFailure, '/p/x')

    expect(followProviderChallenge).not.toHaveBeenCalled()
  })

  it('ignores errors that are not a failed chunk', () => {
    refuseOnChunkLoadFailure(new Error('Navigation cancelled'), '/p/x')
    refuseOnChunkLoadFailure(undefined, '/p/x')

    expect(followProviderChallenge).not.toHaveBeenCalled()
  })

  it('keeps a more specific refusal already on record', () => {
    identityState.refusal = { code: IdentityRefusal.AccessNotGranted, requestId: 'r1' }

    refuseOnChunkLoadFailure(chromeFailure, '/p/x')

    expect(followProviderChallenge).not.toHaveBeenCalled()
  })
})
