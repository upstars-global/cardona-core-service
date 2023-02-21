import { FilterType } from '@model/filter'
import i18n from '@/libs/i18n'
import { TableField } from '@core/components/table-fields/model'

export interface IOptionsBaseFetch {
  readonly saveCountItem?: boolean
}

export type UseListType = {
  readonly entityName: string
  readonly pageName?: string
  readonly isGameTable?: boolean
  readonly fields: Array<TableField>
  readonly ListFilterModel: Function
  readonly SideBarModel?: Function
  readonly beforeRemoveCallback?: Function
}

export type FilterListItem = {
  readonly type: FilterType
  readonly key: string
  readonly trackBy?: string
}

export interface IBaseListConfig {
  readonly withSearch?: boolean
  readonly withDeactivation?: boolean
  readonly withSettings?: boolean
  readonly skeletonRows?: number
  readonly skeletonColumns?: number
  readonly emptyText?: string
  readonly filterList?: Array<FilterListItem>
  readonly staticFilters?: Record<string, string>
  readonly responsive?: boolean
  readonly selectMode?: string
  readonly selectable?: boolean
  readonly small?: boolean
  readonly draggable?: boolean
  readonly defaultPerPage?: number
  readonly withIndependentPagination?: boolean
  readonly searchPlaceholder?: string
  readonly withExport?: boolean
  readonly withCustomFetchList?: boolean
  readonly withMultipleActions?: boolean
  readonly saveCountItem?: boolean
  readonly sidebar?: boolean
  readonly isShowYou?: boolean
  readonly isShowUpdatePassword?: boolean
  readonly onePermissionKey?: string
  readonly withRemoveComment?: boolean
  readonly withRemoveModal?: boolean
}

export class BaseListConfig implements IBaseListConfig {
  readonly withSearch?: boolean
  readonly withDeactivation?: boolean
  readonly withSettings?: boolean
  readonly skeletonRows?: number
  readonly skeletonColumns?: number
  readonly emptyText?: string
  readonly filterList: Array<FilterListItem>
  readonly staticFilters: Record<string, string>
  readonly responsive?: boolean
  readonly selectMode?: string
  readonly selectable?: boolean
  readonly small?: boolean
  readonly draggable?: boolean
  readonly defaultPerPage?: number
  readonly withIndependentPagination?: boolean
  readonly searchPlaceholder?: string
  readonly withExport?: boolean
  readonly withCustomFetchList?: boolean
  readonly withMultipleActions?: boolean
  readonly saveCountItem?: boolean
  readonly sidebar?: boolean
  readonly isShowYou?: boolean
  readonly isShowUpdatePassword?: boolean
  readonly onePermissionKey?: string
  readonly withRemoveComment?: boolean
  readonly withRemoveModal?: boolean

  constructor({
    withSearch,
    withDeactivation,
    withSettings,
    skeletonRows,
    skeletonColumns,
    emptyText,
    filterList,
    staticFilters,
    responsive,
    selectMode,
    selectable,
    small,
    draggable,
    defaultPerPage,
    withIndependentPagination,
    searchPlaceholder,
    withExport,
    withCustomFetchList,
    withMultipleActions,
    saveCountItem,
    sidebar,
    isShowYou,
    isShowUpdatePassword,
    onePermissionKey,
    withRemoveComment,
    withRemoveModal,
  }: IBaseListConfig) {
    this.withSearch = withSearch
    this.withDeactivation = withDeactivation
    this.withSettings = withSettings
    this.skeletonRows = skeletonRows || 10
    this.skeletonColumns = skeletonColumns || 4
    this.emptyText = emptyText || String(i18n.t('emptyState.list'))
    this.filterList = filterList || []
    this.staticFilters = staticFilters || {}
    this.responsive = responsive
    this.selectMode = selectMode
    this.selectable = selectable
    this.small = small
    this.draggable = draggable
    this.defaultPerPage = defaultPerPage
    this.withIndependentPagination = withIndependentPagination
    this.searchPlaceholder = searchPlaceholder
    this.withExport = withExport
    this.withCustomFetchList = withCustomFetchList
    this.withMultipleActions = withMultipleActions
    this.saveCountItem = saveCountItem
    this.sidebar = sidebar
    this.isShowYou = isShowYou
    this.isShowUpdatePassword = isShowUpdatePassword
    this.onePermissionKey = onePermissionKey
    this.withRemoveComment = withRemoveComment
    this.withRemoveModal = withRemoveModal
  }
}

// Export
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
}

export enum DownloadFormat {
  json = 'application/json',
  csv = 'text/csv',
}
