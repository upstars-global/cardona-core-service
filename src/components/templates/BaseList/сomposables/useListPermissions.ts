import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { IBaseListConfig } from '../../../../@model/templates/baseList'
import { basePermissions } from '../../../../helpers/base-permissions'
import type { ListContext, ListItem } from './useListContext'

export interface ListPermissions {
  readonly canCreate: boolean
  readonly canUpdate: boolean
  readonly canUpdateSeo: boolean
  readonly canRemove: boolean
  readonly canExport: boolean
  readonly isShownCreateBtn: boolean
  readonly canUpdateItem: (item?: ListItem) => boolean
  readonly canRemoveItem: (item?: ListItem) => boolean
  readonly canCopyItem: (item?: ListItem) => boolean
  readonly canDraggable: ComputedRef<boolean | undefined>
  readonly getUpdateRoute: (item: ListItem) => RouteLocationRaw
  readonly getDetailsRoute: (item: ListItem) => RouteLocationRaw
}

/**
 * Every "is this action allowed" rule of the list in one place: the ability
 * checks, the per-item callbacks from useList and the routes they guard.
 */
export const useListPermissions = (
  ctx: ListContext,
  props: { config: IBaseListConfig },
  searchQuery: Ref<string>,
): ListPermissions => {
  const { entityName, canUpdateCb, canRemoveCb, canCopyCb } = ctx

  const { canCreate, canUpdate, canUpdateSeo, canRemove, canExport }
    = basePermissions<IBaseListConfig>({ entityName, config: props.config })

  const isShownCreateBtn = !!props.config?.withCreateBtn && ctx.isExistsCreatePage && canCreate

  const canUpdateItem = (item?: ListItem): boolean =>
    canUpdateCb && item ? ctx.isExistsUpdatePage && canUpdateCb(item) : ctx.isExistsUpdatePage

  const canRemoveItem = (item?: ListItem): boolean =>
    canRemoveCb && item ? canRemove && canRemoveCb(item) : canRemove

  const canCopyItem = (item?: ListItem): boolean =>
    canCopyCb && item ? canCopyCb(item) : true

  const canDraggable = computed(() => props.config.small
    ? canUpdate && props.config.draggable && !searchQuery.value
    : canUpdate && props.config.draggable)

  const getUpdateRoute = ({ id }: ListItem): RouteLocationRaw => {
    return ctx.isExistsUpdatePage && (canUpdateCb?.() ?? true)
      ? { name: ctx.UpdatePageName, params: { id } }
      : {} as RouteLocationRaw
  }

  const getDetailsRoute = ({ id }: ListItem): RouteLocationRaw => {
    return ctx.isExistsDetailsPage ? { name: ctx.DetailsPageName, params: { id } } : {} as RouteLocationRaw
  }

  return {
    canCreate,
    canUpdate,
    canUpdateSeo,
    canRemove,
    canExport,
    isShownCreateBtn,
    canUpdateItem,
    canRemoveItem,
    canCopyItem,
    canDraggable,
    getUpdateRoute,
    getDetailsRoute,
  }
}

export default useListPermissions
