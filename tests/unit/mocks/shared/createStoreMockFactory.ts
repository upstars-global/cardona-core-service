import { vi } from 'vitest'

type ActionMock = ReturnType<typeof vi.fn>

export interface StoreMockFactory<ActionName extends string> {
  mock: Record<ActionName, ActionMock>
  reset: () => void
}

/**
 * Builds one module-level vi.fn() per action name, bundled as a single mock object
 * shaped like the real store (useBaseStoreCore, a section's custom store, etc).
 *
 * Pass only the actions a given store actually overrides — e.g. payouts' custom store
 * overrides just `fetchEntityList`, with no create/update/delete at all. Unlisted
 * actions are simply absent from `mock`, instead of being faked with a no-op.
 */
export function createStoreMockFactory<ActionName extends string>(
  actionNames: readonly ActionName[],
): StoreMockFactory<ActionName> {
  const mock = Object.fromEntries(
    actionNames.map(name => [name, vi.fn()]),
  ) as Record<ActionName, ActionMock>

  const reset = () => {
    actionNames.forEach(name => mock[name].mockReset())
  }

  return { mock, reset }
}
