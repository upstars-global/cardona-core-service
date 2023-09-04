import { getPermissionKeys } from './index'
import { permissionPrefix } from '@productConfig'
import store from '../store'
import { PermissionLevel } from '../@model/permission'

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
}

interface PermissionsParams<T> {
  entityName: string
  config: T & ConfigType
}

export function basePermissions<T>({ entityName, config }: PermissionsParams<T>): PermissionsValue {
  const {
    permissionKey: configPermissionKey,
    noPermissionPrefix,
    customPermissionPrefix = permissionPrefix,
    onePermissionKey,
  } = config

  const entityNamePermission = entityName.replace('-', '')
  const permissionPrefixValue = noPermissionPrefix ? undefined : customPermissionPrefix

  const { permissionKey, permissionKeySeo, permissionKeyReport } = getPermissionKeys({
    permissionKey: configPermissionKey,
    permissionPrefix: permissionPrefixValue,
    entityNamePermission,
  })

  const getPermission = (key: string, action: PermissionLevel): boolean =>
    onePermissionKey
      ? store.getters.abilityCan(onePermissionKey, PermissionLevel.view)
      : store.getters.abilityCan(key, action)

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
