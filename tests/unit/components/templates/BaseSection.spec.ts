import '../../mocks/base-section/static'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useRoute, useRouter } from 'vue-router'
import { PageType } from '../../../../src/@model/templates/baseSection'
import DefaultBaseSection from '../../../../src/components/templates/BaseSection/types/default.vue'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { mountComponent, pushMock, readEntity, useMockForm } from '../../mocks/base-section/utils'
import { useAppConfigCoreStore } from '../../../../src/stores/appConfigCore'

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: () => DefaultBaseSection,
  }
})

afterEach(() => {
  // Reset mocks after run each test
  vi.clearAllMocks()
})

describe('BaseSection.vue', () => {
  it('Render is default base section', async () => {
    /// Mount the component with required props
    const wrapper = mountComponent({
      pageType: PageType.Empty,
      withReadAction: false,
    })

    /// Wait for Vue lifecycle hooks to complete
    await wrapper.vm.$nextTick()

    /// Check that the main base section renders successfully
    testOn.existElement({ wrapper, testId: 'base-section-default' })
  })
})

describe('BaseSection.vue — copy entity (forProject/fromProject)', () => {
  const replaceMock = vi.fn().mockResolvedValue(undefined)
  const mockEntity = { id: '123', isActive: true }

  const setupCopyRoute = (query: Record<string, string>) => {
    vi.mocked(useRoute).mockReturnValueOnce({
      params: { id: '123' },
      name: 'TestRoute',
      query,
    })

    vi.mocked(useRouter).mockReturnValueOnce({
      push: pushMock,
      go: vi.fn(),
      replace: replaceMock,
      options: { history: { state: { back: null } } },
    })
  }

  beforeEach(() => {
    readEntity.mockReset()
    replaceMock.mockClear()
    readEntity.mockResolvedValue(mockEntity)
  })

  it('Reads entity with fromProject param when copy query is present', async () => {
    setupCopyRoute({ forProject: 'target-project', fromProject: 'source-project' })

    mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(readEntity).toHaveBeenCalledWith(
      expect.objectContaining({ project: 'source-project' }),
    )
  })

  it('Sets form id to null after reading entity on create page (copy)', async () => {
    setupCopyRoute({ forProject: 'target-project', fromProject: 'source-project' })

    const wrapper = mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(wrapper.vm.form.id).toBeNull()
  })

  it('Replaces route removing forProject and fromProject from query', async () => {
    setupCopyRoute({ forProject: 'target-project', fromProject: 'source-project' })

    mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(replaceMock).toHaveBeenCalledWith({
      name: 'TestRoute',
      params: { id: '' },
      query: {},
    })
  })

  it('Preserves other query params when removing forProject/fromProject', async () => {
    setupCopyRoute({ forProject: 'target-project', fromProject: 'source-project', tab: 'general' })

    mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(replaceMock).toHaveBeenCalledWith({
      name: 'TestRoute',
      params: { id: '' },
      query: { tab: 'general' },
    })
  })

  it('Does not remove query params when no copy params are present', async () => {
    setupCopyRoute({ tab: 'general' })

    mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(replaceMock).toHaveBeenCalledWith({
      name: 'TestRoute',
      params: { id: '' },
      query: { tab: 'general' },
    })
  })

  it('Calls onReceiveEntity with isForAnotherProject=true when forProject differs from fromProject', async () => {
    const onReceiveEntityMock = vi.fn().mockResolvedValue(undefined)

    setupCopyRoute({ forProject: 'target-project', fromProject: 'source-project' })

    mountComponent({
      pageType: PageType.Create,
      useEntity: () => ({
        ...useMockForm(),
        onReceiveEntity: onReceiveEntityMock,
      }),
    })

    await flushPromises()

    expect(onReceiveEntityMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: '123' }),
      true,
    )
  })

  it('Calls onReceiveEntity with isForAnotherProject=false when forProject equals fromProject', async () => {
    const onReceiveEntityMock = vi.fn().mockResolvedValue(undefined)

    setupCopyRoute({ forProject: 'same-project', fromProject: 'same-project' })

    mountComponent({
      pageType: PageType.Create,
      useEntity: () => ({
        ...useMockForm(),
        onReceiveEntity: onReceiveEntityMock,
      }),
    })

    await flushPromises()

    expect(onReceiveEntityMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: '123' }),
      false,
    )
  })

  it('Does not call onReceiveEntity when it is not defined in useEntity', async () => {
    const onReceiveEntityMock = vi.fn()

    setupCopyRoute({ forProject: 'target-project', fromProject: 'source-project' })

    mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(onReceiveEntityMock).not.toHaveBeenCalled()
  })
})

describe('BaseSection.vue — inline project (currentProject query)', () => {
  const mockEntity = { id: '123', isActive: true }

  const setupInlineRoute = (query: Record<string, string>) => {
    vi.mocked(useRoute).mockReturnValueOnce({
      params: { id: '123' },
      name: 'TestRoute',
      query,
    })

    vi.mocked(useRouter).mockReturnValueOnce({
      push: pushMock,
      go: vi.fn(),
      replace: vi.fn().mockResolvedValue(undefined),
      options: { history: { state: { back: null } } },
    })
  }

  beforeEach(() => {
    readEntity.mockReset()
    readEntity.mockResolvedValue(mockEntity)
  })

  it('Sets inline project override from currentProject query on mount', async () => {
    const appConfigCoreStore = useAppConfigCoreStore()
    const setInlineProjectSpy = vi.spyOn(appConfigCoreStore, 'setInlineProject')

    setupInlineRoute({ currentProject: 'bond_staging' })

    mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(setInlineProjectSpy).toHaveBeenCalledWith('bond_staging')
  })

  it('Clears inline project override on unmount', async () => {
    const appConfigCoreStore = useAppConfigCoreStore()
    const setInlineProjectSpy = vi.spyOn(appConfigCoreStore, 'setInlineProject')

    setupInlineRoute({ currentProject: 'bond_staging' })

    const wrapper = mountComponent({ pageType: PageType.Create })

    await flushPromises()

    wrapper.unmount()

    expect(setInlineProjectSpy).toHaveBeenLastCalledWith(null)
  })

  it('Does not set inline project when currentProject query is absent', async () => {
    const appConfigCoreStore = useAppConfigCoreStore()
    const setInlineProjectSpy = vi.spyOn(appConfigCoreStore, 'setInlineProject')

    setupInlineRoute({})

    mountComponent({ pageType: PageType.Create })

    await flushPromises()

    expect(setInlineProjectSpy).not.toHaveBeenCalled()
  })
})
