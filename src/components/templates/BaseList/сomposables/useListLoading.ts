import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IBaseListConfig } from '../../../../@model/templates/baseList'
import { useLoaderStore } from '../../../../stores/loader'
import type { ListContext } from './useListContext'

export interface ListLoadingState {
  readonly isInitialState: Ref<boolean>
  readonly isDebouncedSearch: Ref<boolean>
  readonly searchQuery: Ref<string>
  readonly hasSelectedFilters: Ref<boolean> | ComputedRef<boolean>
}

export interface ListLoading {
  readonly isLoadingList: ComputedRef<boolean>
  readonly isLoadingExport: ComputedRef<boolean>
  readonly emptyListText: ComputedRef<string | undefined>
}

/**
 * Loading and empty-state text of the list. The reactive state it depends on
 * stays owned by the component and is passed in, so nothing is duplicated.
 */
export const useListLoading = (
  ctx: Pick<ListContext, 'entityUrl'>,
  props: { config: IBaseListConfig },
  state: ListLoadingState,
): ListLoading => {
  const loaderStore = useLoaderStore()
  const { t } = useI18n()

  const { isInitialState, isDebouncedSearch, searchQuery, hasSelectedFilters } = state

  const isLoadingExport = computed(() => {
    const listUrl = `${ctx.entityUrl.value}/list/report`

    return loaderStore.isLoadingEndpoint([listUrl])
  })

  const isLoadingList = computed(() => {
    if (props.config.disableLoading)
      return false

    if (isInitialState.value || isDebouncedSearch.value)
      return true

    const listUrl = `${ctx.entityUrl.value}/list`

    if (props.config.loadingOnlyByList) {
      return loaderStore.isLoadingEndpoint([
        listUrl,
        ...(props.config.loadingEndpointArr ?? []),
      ])
    }

    return loaderStore.isLoadingEndpoint([
      listUrl,
      `${ctx.entityUrl.value}/update`,
      `${ctx.entityUrl.value}/active/switch`,
      `${ctx.entityUrl.value}/delete`,
      ...(props.config.loadingEndpointArr ?? []),
    ])
  })

  const emptyListText = computed(() =>
    searchQuery.value || hasSelectedFilters.value ? t('emptyState.emptyRequest') : props.config.emptyText)

  return { isLoadingList, isLoadingExport, emptyListText }
}

export default useListLoading
