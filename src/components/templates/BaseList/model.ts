import { FilterType } from '../../../@model/filter'
import i18n from '../../../libs/i18n'
import { TableField } from '../../../@core/components/table-fields/model'
import { IListSort } from '../../../@model'
import { ProjectFilterTypes } from '@filterConfig'
import { TranslateResult } from 'vue-i18n'
import { ViewInfo } from '../../../@model/view'
import { BColors, BLightColors } from '../../../@model/bootstrap'

export enum SortDirection {
  asc = 'ASC',
  desc = 'DESC',
}
export interface IOptionsBaseFetch {
  readonly listItemModel?: { new (item: unknown): unknown }
  readonly customApiPrefix?: string
}

export type CanActionCb = (item: any) => boolean

export type UseListType = {
  readonly entityName: string
  readonly pageName?: string
  readonly fields: Array<TableField>
  readonly ListFilterModel: Function
  readonly SideBarModel?: Function
  readonly canUpdateCb?: CanActionCb
  readonly beforeRemoveCallback?: Function
  readonly canRemoveCb?: CanActionCb
  readonly ListItemModel?: Function
}

export type FilterListItem = {
  readonly type: FilterType | ProjectFilterTypes
  readonly key: string
  readonly trackBy?: string
}
/**
 * IBaseListConfig - Конфиг базового листа
 *
 * @remarks
 * Все параметры которые принимает базовый лист
 */

/** Все параметры которые принимает базовый лист */
export interface IBaseListConfig {
  /** withSearch - Вкл/выкл поиск в листе */
  readonly withSearch?: boolean

  /** withDeactivation - Вкл/выкл возможночть активировать/деактивировать элемента листа */
  readonly withDeactivation?: boolean

  /** withSettings - Вкл/выкл настройки таблицы */
  readonly withSettings?: boolean

  /** skeletonRows - Количество строк для skeleton таблицы (10 ст) */
  readonly skeletonRows?: number

  /** skeletonColumns - Количество столбцов для skeleton таблицы (4 ст) */
  readonly skeletonColumns?: number

  /** skeletonColumns - Текст когда лист пустой */
  readonly emptyText?: string

  /** filterList - Масив <FilterListItem> фильтров для таблицы */
  readonly filterList?: Array<FilterListItem>

  /** staticFilters - Статический фильтр например playerId. Всегда отправляеться в АПИ */
  readonly staticFilters?: Record<string, string>

  /** staticSorts - Статический сортировка таблицы field: 'position', dir: SortDirection.asc, */
  readonly staticSorts?: IListSort

  /** responsive - Вкл/выкл гибкую таблицу  */
  readonly responsive?: boolean

  /** responsive - Установить режим выделения элементов 'multi'/ 'single'  */
  readonly selectMode?: string

  /** selectable - Вкл/выкл режим выбора элементов */
  readonly selectable?: boolean

  /** small - Вкл/выкл уменьшеный вид таблицы  */
  readonly small?: boolean

  /** draggable - Вкл/выкл перетаскивание элементов  */
  readonly draggable?: boolean

  /** defaultPerPage - Задать количество элементов на странице таблицы */
  readonly defaultPerPage?: number

  /** withIndependentPagination - Установить количество элементов на странице таблицы */
  readonly withIndependentPagination?: boolean

  /** searchPlaceholder - Текст placeholder для поиска */
  readonly searchPlaceholder?: string

  /** selectable - Текст placeholder для поиска */
  readonly withExport?: boolean

  /** withMultipleActions - Вкл/выкл действие с несколькими элементами */
  readonly withMultipleActions?: boolean

  /** sidebar - Вкл/выкл sidebar для элемента */
  readonly sidebar?: boolean

  /** sidebarCollapseMode - Вкл/выкл CollapseMode для sidebar */
  readonly sidebarCollapseMode?: boolean

  /** isShowYou - Вкл/выкл подсветку админа в таблице юзеров (Ищет по id и помечает значком Вы) */
  readonly isShowYou?: boolean

  /** isShowUpdatePassword - Вкл/выкл поле для изменения пароля */
  readonly isShowUpdatePassword?: boolean

  /** onePermissionKey - Задает один доступ на все операции */
  readonly onePermissionKey?: string

  /** withRemoveComment - Добавить/убрать поле коментария в модальном окне при удалении */
  readonly withRemoveComment?: boolean

  /** createFromCopy - Вкл/выкл действие копирования элемента */
  readonly createFromCopy?: boolean

  /** withCustomDrag - Вкл/выкл пользовательское действие на Drag and Drop (На событие @end можно повесить свой обработчик) */
  readonly withCustomDrag?: boolean

  /** pagination - Вкл/выкл pagination в таблице */
  readonly pagination?: boolean

  /** withCreateBtn - Вкл/выкл кнопку Создать элемент */
  readonly withCreateBtn?: boolean

  /** withCustomFetchList - Вкл/выкл пользовательский Fetch для листа. Нужно создать модуль с сторе с названием раздела и там создать пользовательский FetchList */
  readonly withCustomFetchList?: boolean

  /** withCustomDelete - Вкл/выкл пользовательский Delete для листа. Нужно создать модуль с сторе с названием раздела и там создать пользовательский Delete */
  readonly withCustomDelete?: boolean

  /** noPermissionPrefix - Вкл/выкл префикс проекта (true) */
  readonly noPermissionPrefix?: boolean

  /** permissionKey - Пользовательский доступ */
  readonly permissionKey?: string

  /** customModuleName - Пользовательский имя модуля стор */
  readonly customModuleName?: string

  /** customApiPrefix - Пользовательский апи префикс (App.V2.) */
  readonly customApiPrefix?: string

  /** customPermissionPrefix - Пользовательский префикс к доступу */
  readonly customPermissionPrefix?: string

  /** hoverable - Вкл/выкл выдиление строки при навидении на нее курсора */
  readonly hover?: boolean
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
  readonly sidebarCollapseMode?: boolean
  readonly isShowYou?: boolean
  readonly isShowUpdatePassword?: boolean
  readonly onePermissionKey?: string
  readonly withRemoveComment?: boolean
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
  readonly customPermissionPrefix?: string
  readonly hover: boolean

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
    sidebarCollapseMode,
    isShowYou,
    isShowUpdatePassword,
    onePermissionKey,
    withRemoveComment,
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
    customPermissionPrefix,
    hover,
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
    this.sidebarCollapseMode = sidebarCollapseMode
    this.isShowYou = isShowYou
    this.isShowUpdatePassword = isShowUpdatePassword
    this.onePermissionKey = onePermissionKey
    this.withRemoveComment = withRemoveComment
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
    this.customPermissionPrefix = customPermissionPrefix
    this.hover = hover ?? true
  }
}
/**
 * IBaseSectionConfig - Конфиг базовой секции
 *
 * @remarks
 * Все параметры которые принимает базовая секция (Внутрення страница)
 */

/** Все параметры которые принимает базовая секция (Внутрення страница) */
export interface IBaseSectionConfig {
  /** onePermissionKey - Задает один доступ на все операции */
  readonly onePermissionKey?: string

  /** noPermissionPrefix - Вкл/выкл префикс проекта (true) */
  readonly noPermissionPrefix?: boolean

  /** withCustomModuleName - Вкл/выкл пользовательское имя модуля стор */
  readonly withCustomModuleName?: boolean

  /** customModuleName - Пользовательское имя модуля стор */
  readonly customModuleName?: string

  /** customApiPrefix - Пользовательский апи префикс (App.V2.) */
  readonly customApiPrefix?: string

  /** customPermissionPrefix - Пользовательский префикс к доступу */
  readonly customPermissionPrefix?: string

  /** permissionKey - Пользовательский доступ */
  readonly permissionKey?: string

  /** loadingEndpointArr - Масив url за загрузкой которых нужно следить и показывать прелодер */
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
  readonly customPermissionPrefix?: string

  constructor(data: IBaseSectionConfig) {
    this.permissionKey = data?.permissionKey
    this.onePermissionKey = data?.onePermissionKey
    this.withCustomModuleName = data?.withCustomModuleName
    this.noPermissionPrefix = data?.noPermissionPrefix
    this.customModuleName = data?.customModuleName
    this.customApiPrefix = data?.customApiPrefix
    this.loadingEndpointArr = data?.loadingEndpointArr || []
    this.customPermissionPrefix = data?.customPermissionPrefix
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

export interface ISideBarCollapseItem {
  readonly title: TranslateResult
  readonly withBottomSeparator?: boolean
  readonly views: Record<string, ViewInfo>
}

export class SideBarCollapseItem {
  readonly title: TranslateResult
  readonly withBottomSeparator?: boolean
  readonly views: Record<string, ViewInfo>

  constructor(data: ISideBarCollapseItem) {
    this.title = data.title
    this.withBottomSeparator = data?.withBottomSeparator
    this.views = data.views
  }
}

export interface BaseListItem {
  rowVariant?: BColors | BLightColors
}
