import type { TranslateResult } from 'vue-i18n'
import { i18n } from '../../plugins/i18n'
import type { FilterType } from '../filter'

import type { ViewInfo } from '../view'
import type { BColors, BLightColors } from '../bootstrap' // TODO remove
import { SelectMode } from '../../@model/enums/selectMode'
import type { SortItem } from '../../@core/types'
import type { useBaseStoreCore } from '../../stores/baseStoreCore'
import type { MultipleActions } from '../../@model/enums/multipleActions'
import type { TableField } from './tableFields'
import type { ProjectFilterTypes } from '@filterConfig'

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}
export interface IOptionsBaseFetch {
  readonly listItemModel?: { new (item: unknown): unknown }
  readonly customApiPrefix?: string
}

export type BaseListStore = ReturnType<typeof useBaseStoreCore>

export interface UseListType<
  ItemModel extends object = object,
  ListFilterModel extends object = object,
  SideBarModel extends object = object,
> {
  readonly entityName: string
  readonly pageName?: string
  readonly fields: Array<TableField>
  readonly ListFilterModel?: new (...args: any[]) => ListFilterModel
  readonly SideBarModel?: new (...args: any[]) => SideBarModel
  readonly beforeRemoveCallback?: (item: ItemModel) => boolean
  readonly ListItemModel?: new (...args: any[]) => ItemModel
  readonly canUpdateCb?: (item: ItemModel) => boolean
  readonly canRemoveCb?: (item: ItemModel) => boolean
  readonly useStore?: BaseListStore
}

export interface FilterListItem {
  readonly type: FilterType | ProjectFilterTypes
  readonly key: string
  readonly trackBy?: string
}

type StaticFilters = Record<string, string | string[] | number | number[]>

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

  /** withDeactivation - Вкл/выкл возможность активировать/деактивировать элемента листа */
  readonly withDeactivation?: boolean

  /** withDeactivationBySpecificAction - Вкл/выкл возможночть активировать/деактивировать элемента листа по отдельному action в baseStoreCore */
  readonly withDeactivationBySpecificAction?: boolean

  /** withSettings - Вкл/выкл настройки таблицы */
  readonly withSettings?: boolean

  /** emptyText - Текст когда лист пустой */
  readonly emptyText?: string

  /** filterList - Массив <FilterListItem> фильтров для таблицы */
  readonly filterList?: Array<FilterListItem>

  /** staticFilters - Статический фильтр например playerId. Всегда отправляется в АПИ */
  readonly staticFilters?: StaticFilters

  /** staticSorts - Статический сортировка таблицы field: 'position', dir: SortDirection.asc, */
  readonly staticSorts?: SortItem

  /** selectMode - Установить режим выделения элементов 'multi'/ 'single'  */
  readonly selectMode?: SelectMode

  /** selectable - Вкл/выкл режим выбора элементов */
  readonly selectable?: boolean

  /** small - Вкл/выкл уменьшенный вид таблицы  */
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

  /** formatOfExports - Указать какие форматы должен поддерживать список */

  readonly formatOfExports?: Array<ExportFormat>

  /** maxExportItems - Указать максимальное количество на export элементов списка  */

  readonly maxExportItems?: number

  /** withMultipleActions - Вкл/выкл действие с несколькими элементами */
  readonly withMultipleActions?: boolean | 'remove' | 'toggleStatus'

  /** sidebar - Вкл/выкл sidebar для элемента */
  readonly sidebar?: boolean

  /** cbShowSidebar - метод перед отображением sidebar */
  readonly cbShowSidebar?: Function

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

  /** withRemoveComment - Вкл/выкл модальное окно при удалении */
  readonly withRemoveModal?: boolean

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

  /** customApiPrefix - Пользовательский апи префикс (App.V2.) */
  readonly customApiPrefix?: string

  /** customPermissionPrefix - Пользовательский префикс к доступу */
  readonly customPermissionPrefix?: string

  /** hoverable - Вкл/выкл выдиление строки при навидении на нее курсора */
  readonly hover?: boolean

  /** skeletonRows - указать количество строк скелетона */
  readonly skeletonRows?: number

  /** skeletonCols - указать количество колонок скелетона */
  readonly skeletonCols?: number

  /** loadingOnlyByList - Показывать скелетон только при загрузке листа */
  readonly loadingOnlyByList?: boolean

  /** loadingEndpointArr - Массив url за загрузкой которых нужно отслеживать и показывать скелетон */
  readonly loadingEndpointArr?: Array<string>

  /** hideSearchBlock - Скрывать полностью верхний блок с поиском, фильтром, создании айтема */
  readonly hideSearchBlock?: boolean

  /** closeFilterOnPagination - Закрывать фильтр во время переключения пагинации */
  readonly closeFilterOnPagination?: boolean

  /** withTopPagination - Показывть пагинацию вверху страницы */
  readonly withTopPagination?: boolean

  /** showExpand - Показывать выпаадшку (expand) для строки спсика для этого надо поместить данные в поле groups  */
  readonly showExpand?: boolean

  /** saveSort - Flag для сохранния сортировки в local storage  */
  readonly saveSort?: boolean

  /** disableLoading - Flag для блокирования loading state  */
  readonly disableLoading?: boolean
}

export class BaseListConfig implements IBaseListConfig {
  readonly withSearch?: boolean
  readonly withDeactivation?: boolean
  readonly withDeactivationBySpecificAction?: boolean
  readonly withSettings?: boolean
  readonly emptyText?: string
  readonly filterList: Array<FilterListItem>
  readonly staticFilters: StaticFilters
  readonly staticSorts?: SortItem
  readonly selectMode?: SelectMode
  readonly selectable?: boolean
  readonly small?: boolean
  readonly draggable?: boolean
  readonly defaultPerPage?: number
  readonly withIndependentPagination?: boolean
  readonly searchPlaceholder?: string
  readonly withExport?: boolean
  readonly formatOfExports?: Array<ExportFormat>
  readonly maxExportItems?: number
  readonly withMultipleActions?: boolean | MultipleActions
  readonly sidebar?: boolean
  readonly cbShowSidebar?: Function
  readonly sidebarCollapseMode?: boolean
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
  readonly customApiPrefix?: string
  readonly customPermissionPrefix?: string
  readonly hover: boolean
  readonly skeletonRows?: number
  readonly skeletonCols?: number
  readonly loadingOnlyByList?: boolean
  readonly loadingEndpointArr: Array<string>
  readonly hideSearchBlock?: boolean
  readonly closeFilterOnPagination?: boolean
  readonly showExpand?: boolean
  readonly withTopPagination?: boolean
  readonly saveSort?: boolean
  readonly disableLoading?: boolean

  constructor({
    withSearch,
    withDeactivation,
    withDeactivationBySpecificAction,
    withSettings,
    emptyText,
    filterList,
    staticFilters,
    staticSorts,
    selectMode,
    selectable,
    small,
    draggable,
    defaultPerPage,
    withIndependentPagination,
    searchPlaceholder,
    withExport,
    formatOfExports,
    maxExportItems,
    withMultipleActions,
    sidebar,
    cbShowSidebar,
    sidebarCollapseMode,
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
    customApiPrefix,
    customPermissionPrefix,
    hover,
    skeletonRows,
    skeletonCols,
    loadingOnlyByList,
    loadingEndpointArr,
    hideSearchBlock,
    closeFilterOnPagination,
    showExpand,
    withTopPagination,
    saveSort,
    disableLoading,
  }: IBaseListConfig) {
    this.withSearch = withSearch
    this.withDeactivation = withDeactivation
    this.withDeactivationBySpecificAction = withDeactivationBySpecificAction
    this.withSettings = withSettings
    this.emptyText = emptyText || i18n.t('emptyState.list')
    this.filterList = filterList || []
    this.staticFilters = staticFilters || {}
    this.staticSorts = staticSorts
    this.selectMode = selectMode || SelectMode.Page
    this.selectable = selectable
    this.small = small
    this.draggable = draggable
    this.defaultPerPage = defaultPerPage
    this.withIndependentPagination = withIndependentPagination
    this.searchPlaceholder = searchPlaceholder
    this.withExport = withExport
    this.formatOfExports = formatOfExports ?? [ExportFormat.JSON, ExportFormat.CSV]
    this.maxExportItems = maxExportItems
    this.withMultipleActions = withMultipleActions
    this.sidebar = sidebar
    this.cbShowSidebar = cbShowSidebar
    this.sidebarCollapseMode = sidebarCollapseMode
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
    this.customApiPrefix = customApiPrefix
    this.customPermissionPrefix = customPermissionPrefix
    this.hover = hover ?? true
    this.skeletonRows = skeletonRows
    this.skeletonCols = skeletonCols
    this.loadingOnlyByList = loadingOnlyByList
    this.loadingEndpointArr = loadingEndpointArr ?? []
    this.hideSearchBlock = hideSearchBlock
    this.closeFilterOnPagination = closeFilterOnPagination
    this.showExpand = showExpand
    this.withTopPagination = withTopPagination
    this.saveSort = saveSort ?? true
    this.disableLoading = disableLoading
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

  /** ignoreSeoPermission - Флаг для передачи на бекенд формы с seo and localisation полями */
  readonly ignoreSeoPermission?: boolean

  /** withoutDeleteModal - Флаг для скрытия модалки удаления нужно для использования BaseSection внутри модалки */
  readonly withoutDeleteModal?: boolean

  /** withoutConfirmModal - Флаг для скрытия модалки подтверждения нужно для использования BaseSection внутри модалки */
  readonly withoutConfirmModal?: boolean

  /** backToTheHistoryLast - Кнопка Cancel возвращает не предыдущую страницу, если такая есть в истории роута */
  readonly backToTheHistoryLast?: boolean

  /** isModalSection - Флаг для отображения секции в модалке. Нужно использовать emits on-save, on-cancel */
  readonly isModalSection?: boolean

  /** initializeWithUpdate - Флаг для инициализации данных формы на основе update response  */
  readonly initializeWithUpdate?: boolean
}

export class BaseSectionConfig implements IBaseSectionConfig { // TODO: Moved to base section model
  readonly onePermissionKey?: string
  readonly permissionKey?: string
  readonly withCustomModuleName?: boolean
  readonly noPermissionPrefix?: boolean
  readonly customModuleName?: string
  readonly customApiPrefix?: string
  readonly loadingEndpointArr: Array<string>
  readonly customPermissionPrefix?: string
  readonly ignoreSeoPermission?: boolean
  readonly withoutDeleteModal?: boolean
  readonly withoutConfirmModal?: boolean
  readonly backToTheHistoryLast?: boolean
  readonly isModalSection?: boolean
  readonly initializeWithUpdate: boolean
  constructor(data: IBaseSectionConfig) {
    this.permissionKey = data?.permissionKey
    this.onePermissionKey = data?.onePermissionKey
    this.withCustomModuleName = data?.withCustomModuleName
    this.noPermissionPrefix = data?.noPermissionPrefix
    this.customModuleName = data?.customModuleName
    this.customApiPrefix = data?.customApiPrefix
    this.loadingEndpointArr = data?.loadingEndpointArr || []
    this.customPermissionPrefix = data?.customPermissionPrefix
    this.ignoreSeoPermission = data?.ignoreSeoPermission || false
    this.withoutDeleteModal = data?.withoutDeleteModal || false
    this.withoutConfirmModal = data?.withoutConfirmModal || false
    this.backToTheHistoryLast = data?.backToTheHistoryLast || false
    this.isModalSection = data?.isModalSection || false
    this.initializeWithUpdate = data?.initializeWithUpdate || false
  }
}

// Export
export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  XLSX = 'xlsx',
  XML = 'xml',
}

export enum DownloadFormat {
  json = 'application/json',
  csv = 'text/csv',
  xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xml = 'application/xml',
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

export enum BaseListSlots {
  TableHeader = 'table-header',
  SidebarActions = 'sidebar-actions',
  SidebarActionItems = 'sidebar-action-items',
  RightSearchBtn = 'right-search-btn',
  LeftSearchBtn = 'left-search-btn',
  CustomFilter = 'custom-filter',
  MultipleActions = 'multiple-actions',
  TableFieldSetting = 'table-field-setting',
  Empty = 'empty',
  PrependActionItem = 'prepend-action-item',
  AppendActionItem = 'append-action-item',
  DetailsActionItem = 'details-action-item',
}
