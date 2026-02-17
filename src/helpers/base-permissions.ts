import { isBoolean } from 'lodash'
import { ListPermissionLevel, PermissionLevel } from '../@model/permission'
import { useUserStore } from '../stores/user'
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
  noPermissions?: ListPermissionLevel | ListPermissionLevel[]
}

interface PermissionsParams<T> {
  entityName: string
  config: T & ConfigType
}

interface PermissionCheck {
  key: string
  action: PermissionLevel
  noPermissionLevel: ListPermissionLevel
}

export function basePermissions<T>({ entityName, config }: PermissionsParams<T>): PermissionsValue {
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

  const isFullAccess = isBoolean(noPermissions) && noPermissions

  const { permissionKey, permissionKeySeo, permissionKeyReport } = getPermissionKeys({
    permissionKey: configPermissionKey,
    permissionPrefix: !configPermissionKey ? permissionPrefixValue : '',
    entityNamePermission,
  })

  const getPermission = ({ key, action, noPermissionLevel }: PermissionCheck): boolean => {
    if (isFullAccess)
      return true

    if (Array.isArray(noPermissions)) {
      if (noPermissions.includes(noPermissionLevel))
        return true

      if ([
        ListPermissionLevel.seoCreate,
        ListPermissionLevel.seoUpdate,
        ListPermissionLevel.seoView,
      ].includes(noPermissionLevel)
        && noPermissions.includes(ListPermissionLevel.seo))
        return true
    }

    return onePermissionKey
      ? userStore.abilityCan(onePermissionKey, PermissionLevel.view)
      : userStore.abilityCan(key, action)
  }

  return {
    canCreate: getPermission({
      key:
      permissionKey,
      action: PermissionLevel.create,
      noPermissionLevel: ListPermissionLevel.create,
    }),
    canUpdate: getPermission({
      key: permissionKey,
      action: PermissionLevel.update,
      noPermissionLevel: ListPermissionLevel.update,
    }),
    canUpdateSeo: getPermission({
      key: permissionKeySeo,
      action: PermissionLevel.update,
      noPermissionLevel: ListPermissionLevel.seoUpdate,
    }),
    canCreateSeo: getPermission({
      key: permissionKeySeo,
      action: PermissionLevel.create,
      noPermissionLevel: ListPermissionLevel.seoCreate,
    }),
    canViewSeo: getPermission({
      key: permissionKeySeo,
      action: PermissionLevel.view,
      noPermissionLevel: ListPermissionLevel.seoView,
    }),
    canRemove: getPermission({
      key: permissionKey,
      action: PermissionLevel.delete,
      noPermissionLevel: ListPermissionLevel.delete,
    }),
    canExport: getPermission({
      key: permissionKeyReport,
      action: PermissionLevel.view,
      noPermissionLevel: ListPermissionLevel.export,
    }),
  }
}
