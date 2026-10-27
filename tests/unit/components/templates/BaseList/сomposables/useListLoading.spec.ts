import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'

const mockIsLoadingEndpoint = vi.fn(() => false)

vi.mock('../../../../../../src/stores/loader', () => ({
  useLoaderStore: () => ({
    isLoadingEndpoint: mockIsLoadingEndpoint,
  }),
}))

const { useListLoading } = await import('../../../../../../src/components/templates/BaseList/сomposables/useListLoading')

// useI18n() needs an active component instance (composition-mode i18n), so the
// composable is exercised through a thin host component instead of being
// called directly, mirroring useNavGroups.spec.ts.
function mountComposable(config: Record<string, any>, state: Record<string, any>) {
  let result: ReturnType<typeof useListLoading>

  const TestComponent = defineComponent({
    setup() {
      result = useListLoading({ entityUrl: ref('tournaments') }, { config }, state as any)

      return () => null
    },
  })

  mount(TestComponent)

  return result!
}

describe('useListLoading', () => {
  beforeEach(() => {
    mockIsLoadingEndpoint.mockReset()
    mockIsLoadingEndpoint.mockReturnValue(false)
  })

  const baseState = () => ({
    isInitialState: ref(false),
    isDebouncedSearch: ref(false),
    searchQuery: ref(''),
    hasSelectedFilters: ref(false),
  })

  it('is never loading when config.disableLoading is true', () => {
    const { isLoadingList } = mountComposable({ disableLoading: true }, baseState())

    expect(isLoadingList.value).toBe(false)
    expect(mockIsLoadingEndpoint).not.toHaveBeenCalled()
  })

  it('is loading while in the initial state or while a search is debounced', () => {
    const { isLoadingList } = mountComposable({}, { ...baseState(), isInitialState: ref(true) })

    expect(isLoadingList.value).toBe(true)

    const { isLoadingList: isLoadingList2 } = mountComposable({}, { ...baseState(), isDebouncedSearch: ref(true) })

    expect(isLoadingList2.value).toBe(true)
  })

  it('checks only the list endpoint (plus loadingEndpointArr) when loadingOnlyByList is set', () => {
    const { isLoadingList } = mountComposable(
      { loadingOnlyByList: true, loadingEndpointArr: ['custom/endpoint'] },
      baseState(),
    )

    isLoadingList.value

    expect(mockIsLoadingEndpoint).toHaveBeenCalledWith([
      'tournaments/list',
      'custom/endpoint',
    ])
  })

  it('checks the list endpoint plus the mutation endpoints by default', () => {
    const { isLoadingList } = mountComposable({ loadingEndpointArr: ['custom/endpoint'] }, baseState())

    isLoadingList.value

    expect(mockIsLoadingEndpoint).toHaveBeenCalledWith([
      'tournaments/list',
      'tournaments/update',
      'tournaments/active/switch',
      'tournaments/delete',
      'custom/endpoint',
    ])
  })

  it('checks the report endpoint for isLoadingExport', () => {
    const { isLoadingExport } = mountComposable({}, baseState())

    isLoadingExport.value

    expect(mockIsLoadingEndpoint).toHaveBeenCalledWith(['tournaments/list/report'])
  })

  it('falls back to config.emptyText when there is no search and no selected filters', () => {
    const { emptyListText } = mountComposable({ emptyText: 'Nothing here' }, baseState())

    expect(emptyListText.value).toBe('Nothing here')
  })

  it('shows the generic "empty request" message while searching', () => {
    const { emptyListText } = mountComposable({ emptyText: 'Nothing here' }, { ...baseState(), searchQuery: ref('foo') })

    expect(emptyListText.value).toBe('Nothing was found for your request. Please refine your request.')
  })

  it('shows the generic "empty request" message when filters are selected', () => {
    const { emptyListText } = mountComposable({ emptyText: 'Nothing here' }, { ...baseState(), hasSelectedFilters: ref(true) })

    expect(emptyListText.value).toBe('Nothing was found for your request. Please refine your request.')
  })
})
