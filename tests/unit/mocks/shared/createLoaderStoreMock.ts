import { vi } from 'vitest'

/**
 * Shared mock for `useLoaderStore` (src/stores/loader.ts).
 *
 * BaseList/BaseSection never hold a local `isLoading` ref — loading is always derived from
 * `loaderStore.isLoadingEndpoint(url)`. Any contract that needs a loading-state assertion
 * must mock this store instead of a component prop/ref.
 */
export function createLoaderStoreMock(initialLoading = false) {
  let loading = initialLoading

  const mock = {
    isLoadingEndpoint: vi.fn(() => loading),
    isLoadingEndpointFullPath: vi.fn(() => loading),
  }

  const setLoading = (value: boolean) => {
    loading = value
  }

  return { mock, setLoading }
}
