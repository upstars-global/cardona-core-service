import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { BaseListStore, UseListType } from '../../../../@model/templates/baseList'
import type { TableField } from '../../../../@model/templates/tableFields'
import { checkExistsPage, convertCamelCase } from '../../../../helpers'
import { useBaseStoreCore } from '../../../../stores/baseStoreCore'

export type ListItem = Record<string, any>

/**
 * Removes the #tabName from entityName
 * Example: "Tournaments#tabName" -> "Tournaments"
 * This helps save different settings for the same entity across different tabs
 */
export const parseEntityNameWithTabs = (entityName: string): string =>
  entityName.replace(/#\w+/, '').replace('..', '.')

type ListDefinition = Omit<UseListType, 'useStore' | 'canUpdateCb' | 'canRemoveCb' | 'canCopyCb'> & {
  readonly canUpdateCb?: (item?: ListItem) => boolean
  readonly canRemoveCb?: (item?: ListItem) => boolean
  readonly canCopyCb?: (item?: ListItem) => boolean
  readonly useStore?: () => BaseListStore
}

export interface ListContext extends ListDefinition {
  readonly fields: ComputedRef<Array<TableField>> | Array<TableField>
  readonly customStore: BaseListStore | null
  readonly CreatePageName: string
  readonly UpdatePageName: string
  readonly DetailsPageName: string
  readonly isExistsCreatePage: boolean
  readonly isExistsUpdatePage: boolean
  readonly isExistsDetailsPage: boolean
  readonly fetchAction: CallableFunction
  readonly deleteAction: CallableFunction
  readonly multipleDeleteAction: CallableFunction
  readonly fetchReportAction: CallableFunction
  readonly normalizedEntityName: ComputedRef<string>
  readonly entityUrl: ComputedRef<string>
}

/**
 * The single source of truth about "what this list is": unpacks the useList
 * definition and derives page names, store actions and the entity url from it.
 */
export const useListContext = (props: { useList: unknown }): ListContext => {
  const baseStoreCore = useBaseStoreCore()

  const {
    entityName,
    fields,
    ListFilterModel,
    SideBarModel,
    pageName,
    canUpdateCb,
    canRemoveCb,
    canCopyCb,
    beforeRemoveCallback,
    ListItemModel,
    useStore,
  } = (props.useList as () => ListDefinition)()

  const customStore = useStore ? useStore() : null

  // Pages
  const CreatePageName = pageName ? `${pageName}Create` : `${parseEntityNameWithTabs(entityName)}Create`
  const UpdatePageName = pageName ? `${pageName}Update` : `${parseEntityNameWithTabs(entityName)}Update`
  const DetailsPageName = pageName ? `${pageName}Card` : `${parseEntityNameWithTabs(entityName)}Card`

  const isExistsCreatePage = checkExistsPage(CreatePageName)
  const isExistsUpdatePage = checkExistsPage(UpdatePageName)
  const isExistsDetailsPage = checkExistsPage(DetailsPageName)

  // Actions
  const fetchAction: CallableFunction = customStore?.fetchEntityList
    ? customStore.fetchEntityList
    : baseStoreCore.fetchEntityList

  const deleteAction = customStore?.deleteEntity
    ? customStore.deleteEntity
    : baseStoreCore.deleteEntity

  const multipleDeleteAction = customStore?.multipleDeleteEntity
    ? customStore.multipleDeleteEntity
    : baseStoreCore.multipleDeleteEntity

  const fetchReportAction = customStore?.fetchReport
    ? customStore.fetchReport
    : baseStoreCore.fetchReport

  const normalizedEntityName = computed(() => {
    return entityName.replace(/-(.)/g, (_, char) => `-${char.toLowerCase()}`)
  })

  const entityUrl = computed(() => {
    return parseEntityNameWithTabs(convertCamelCase(normalizedEntityName.value, '/'))
  })

  return {
    entityName,
    fields,
    ListFilterModel,
    SideBarModel,
    ListItemModel,
    pageName,
    canUpdateCb,
    canRemoveCb,
    canCopyCb,
    beforeRemoveCallback,
    customStore,
    CreatePageName,
    UpdatePageName,
    DetailsPageName,
    isExistsCreatePage,
    isExistsUpdatePage,
    isExistsDetailsPage,
    fetchAction,
    deleteAction,
    multipleDeleteAction,
    fetchReportAction,
    normalizedEntityName,
    entityUrl,
  }
}

export default useListContext
