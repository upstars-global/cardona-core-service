import { FilterType } from '../../../@model/filter'
import i18n from '../../../libs/i18n'
import { TableField } from '../../../@core/components/table-fields/model'
import { IListSort } from '../../../@model'
import { ProjectFilterTypes } from '@filterConfig'

export enum SortDirection {
  asc = 'ASC',
  desc = 'DESC',
}
export interface IOptionsBaseFetch {
  readonly listItemModel?: { new (item: unknown): unknown }
  readonly customApiPrefix?: string
}

export type UseListType = {
  readonly entityName: string
  readonly pageName?: string
  readonly fields: Array<TableField>
  readonly ListFilterModel: Function
  readonly SideBarModel?: Function
  readonly beforeRemoveCallback?: Function
  readonly ListItemModel?: Function
}

export type FilterListItem = {
  readonly type: FilterType | ProjectFilterTypes
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
  readonly staticSorts?: IListSort
  readonly responsive?: boolean
  readonly selectMode?: string
  readonly selectable?: boolean
  readonly small?: boolean
  readonly draggable?: boolean
  readonly defaultPerPage?: number
  readonly withIndependentPagination?: boolean
  readonly searchPlaceholder?: string
  readonly withExport?: boolean
  readonly withMultipleActions?: boolean
  readonly sidebar?: boolean
  readonly isShowYou?: boolean
  readonly isShowUpdatePassword?: boolean
  readonly onePermissionKey?: string
  readonly withRemoveComment?: boolean
  readonly withRemoveModal?: boolean
  readonly createFromCopy?: boolean
  readonly withCustomDrag?: boolean
  readonly pagination?: boolean
  readonly withCreateBtn?: boolean
  readonly withCustomFetchList?: boolean
  readonly withCustomDelete?: boolean
  readonly noPermissionPrefix?: boolean
  readonly permissionKey?: string
  readonly customModuleName?: string
  readonly customApiPrefix?: string
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
  readonly staticSorts?: IListSort
  readonly responsive?: boolean
  readonly selectMode?: string
  readonly selectable?: boolean
  readonly small?: boolean
  readonly draggable?: boolean
  readonly defaultPerPage?: number
  readonly withIndependentPagination?: boolean
  readonly searchPlaceholder?: string
  readonly withExport?: boolean
  readonly withMultipleActions?: boolean
  readonly sidebar?: boolean
  readonly isShowYou?: boolean
  readonly isShowUpdatePassword?: boolean
  readonly onePermissionKey?: string
  readonly withRemoveComment?: boolean
  readonly withRemoveModal?: boolean
  readonly createFromCopy?: boolean
  readonly withCustomDrag?: boolean
  readonly pagination?: boolean
  readonly withCreateBtn?: boolean
  readonly withCustomFetchList?: boolean
  readonly withCustomDelete?: boolean
  readonly noPermissionPrefix?: boolean
  readonly permissionKey?: string
  readonly customModuleName?: string
  readonly customApiPrefix?: string

  constructor({
    withSearch,
    withDeactivation,
    withSettings,
    skeletonRows,
    skeletonColumns,
    emptyText,
    filterList,
    staticFilters,
    staticSorts,
    responsive,
    selectMode,
    selectable,
    small,
    draggable,
    defaultPerPage,
    withIndependentPagination,
    searchPlaceholder,
    withExport,
    withMultipleActions,
    sidebar,
    isShowYou,
    isShowUpdatePassword,
    onePermissionKey,
    withRemoveComment,
    withRemoveModal,
    createFromCopy,
    withCustomDrag,
    pagination,
    withCreateBtn,
    withCustomFetchList,
    withCustomDelete,
    noPermissionPrefix,
    permissionKey,
    customModuleName,
    customApiPrefix,
  }: IBaseListConfig) {
    this.withSearch = withSearch
    this.withDeactivation = withDeactivation
    this.withSettings = withSettings
    this.skeletonRows = skeletonRows || 10
    this.skeletonColumns = skeletonColumns || 4
    this.emptyText = emptyText || String(i18n.t('emptyState.list'))
    this.filterList = filterList || []
    this.staticFilters = staticFilters || {}
    this.staticSorts = staticSorts
    this.responsive = responsive
    this.selectMode = selectMode
    this.selectable = selectable
    this.small = small
    this.draggable = draggable
    this.defaultPerPage = defaultPerPage
    this.withIndependentPagination = withIndependentPagination
    this.searchPlaceholder = searchPlaceholder
    this.withExport = withExport
    this.withMultipleActions = withMultipleActions
    this.sidebar = sidebar
    this.isShowYou = isShowYou
    this.isShowUpdatePassword = isShowUpdatePassword
    this.onePermissionKey = onePermissionKey
    this.withRemoveComment = withRemoveComment
    this.withRemoveModal = withRemoveModal
    this.withCustomDrag = withCustomDrag
    this.pagination = pagination ?? true
    this.createFromCopy = createFromCopy
    this.withCreateBtn = withCreateBtn ?? true
    this.withCustomFetchList = withCustomFetchList
    this.withCustomDelete = withCustomDelete
    this.noPermissionPrefix = noPermissionPrefix
    this.permissionKey = permissionKey
    this.customModuleName = customModuleName
    this.customApiPrefix = customApiPrefix
  }
}

export interface IBaseSectionConfig {
  readonly onePermissionKey?: string
  readonly withCustomModuleName?: boolean
  readonly noPermissionPrefix?: boolean
  readonly customModuleName?: string
  readonly customApiPrefix?: string
  readonly permissionKey?: string
  readonly loadingEndpointArr?: Array<string>
}

export class BaseSectionConfig implements IBaseSectionConfig {
  readonly onePermissionKey?: string
  readonly permissionKey?: string
  readonly withCustomModuleName?: boolean
  readonly noPermissionPrefix?: boolean
  readonly customModuleName?: string
  readonly customApiPrefix?: string
  readonly loadingEndpointArr: Array<string>
  constructor(data: IBaseSectionConfig) {
    this.permissionKey = data?.permissionKey
    this.onePermissionKey = data?.onePermissionKey
    this.withCustomModuleName = data?.withCustomModuleName
    this.noPermissionPrefix = data?.noPermissionPrefix
    this.customModuleName = data?.customModuleName
    this.customApiPrefix = data?.customApiPrefix
    this.loadingEndpointArr = data?.loadingEndpointArr || []
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
