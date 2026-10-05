import { vi } from 'vitest'

/**
 * Shared mock for `useBaseSectionErrorsStore` (src/stores/baseSectionErrors.ts).
 *
 * Error state on BaseSection/BaseList is never a local ref — it is always derived from
 * `baseSectionErrorStore.isErrorEndpoint(urls)`. Any contract that needs an error-state
 * assertion must mock this store instead of a component prop/ref.
 */
export function createBaseSectionErrorsStoreMock(initialError = false) {
  let hasError = initialError

  const mock = {
    isErrorEndpoint: vi.fn(() => hasError),
  }

  const setError = (value: boolean) => {
    hasError = value
  }

  return { mock, setError }
}
