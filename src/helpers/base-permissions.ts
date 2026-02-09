import { isBoolean } from 'lodash'
import { PermissionLevel } from '../@model/permission'
import { useUserStore } from '../stores/user'
import type { NoPermissions } from '../@model/templates/baseList'
import { getPermissionKeys } from './index'
import { permissionPrefix } from '@productConfig'

interface PermissionsValue {
  canCreate: boolean
  canUpdate: boolean
  canUpdateSeo: boolean
  canCreateSeo: boolean
  canViewSeo: boolean
  canRemove: boolean
  canExport: boolean
}

interface ConfigType {
  permissionKey?: string
  noPermissionPrefix?: boolean
  customPermissionPrefix?: string
  onePermissionKey?: string
  noPermissions?: NoPermissions
}

interface PermissionsParams<T> {
  entityName: string
  config: T & ConfigType
}

export function basePermissions<T>({ entityName, config }: PermissionsParams<T>): PermissionsValue {
  // const store = useStore()
  const userStore = useUserStore()

  const {
    permissionKey: configPermissionKey,
    noPermissionPrefix,
    customPermissionPrefix = permissionPrefix,
    onePermissionKey,
    noPermissions,
  } = config

  const entityNamePermission = entityName.replace('-', '')
  const permissionPrefixValue = noPermissionPrefix ? undefined : customPermissionPrefix

  const isullAccess = isBoolean(noPermissions) && noPermissions

  const { permissionKey, permissionKeySeo, permissionKeyReport } = getPermissionKeys({
    permissionKey: configPermissionKey,
    permissionPrefix: !configPermissionKey ? permissionPrefixValue : '',
    entityNamePermission,
  })

  const getPermission = (key: string, action: PermissionLevel): boolean => {
    if (isullAccess)
      return true

    if (Array.isArray(noPermissions) && noPermissions.includes(action))
      return true

    return onePermissionKey
      ? userStore.abilityCan(onePermissionKey, PermissionLevel.view)
      : userStore.abilityCan(key, action)
  }

  return {
    canCreate: getPermission(permissionKey, PermissionLevel.create),
    canUpdate: getPermission(permissionKey, PermissionLevel.update),
    canUpdateSeo: getPermission(permissionKeySeo, PermissionLevel.update),
    canCreateSeo: getPermission(permissionKeySeo, PermissionLevel.create),
    canViewSeo: getPermission(permissionKeySeo, PermissionLevel.view),
    canRemove: getPermission(permissionKey, PermissionLevel.delete),
    canExport: getPermission(permissionKeyReport, PermissionLevel.view),
  }
}
