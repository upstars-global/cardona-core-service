import type { RouterConfig } from '../@model/router'
import { convertCamelCase } from '../helpers/index'
import { permissionPrefix } from '@productConfig'

export const useRedirectToNotFoundPage = router => async (errorType: string): Promise<boolean> => {
  if (errorType === 'NOT_FOUND') {
    await router.push({ name: 'NotFound' })

    return true
  }

  return false
}

export default function sectionRouterGenerator(sectionConfigs: Array<RouterConfig>) {
  const arrRouters: Array<any> = []

  sectionConfigs.forEach((sectionConfig: RouterConfig) => {
    let importSTR = sectionConfig.isConvertName
      ? convertCamelCase(sectionConfig.name, '/')
      : sectionConfig.name

    if (sectionConfig.sectionName)
      importSTR = `${sectionConfig.sectionName}/${importSTR}`

    const entityUrl = sectionConfig.isProject ? `/:project/${importSTR}` : `/${importSTR}`
    const entityName = sectionConfig.name[0].toUpperCase() + sectionConfig.name.slice(1)
    const permission = `${permissionPrefix}-${convertCamelCase(sectionConfig.name, '-')}`

    arrRouters.push(
      ...[
        {
          path: entityUrl,
          name: `${entityName}List`,
          component: () => import(`@/pages/${importSTR}/list/index.vue`),
          meta: {
            title: `${sectionConfig.name}.list`,
            permission,
            breadcrumb: [
              {
                title: `${sectionConfig.name}.list`,
                active: true,
              },
            ],
          },
        },
        {
          path: `${entityUrl}/create/:id?`,
          name: `${entityName}Create`,
          component: () => import(`@/pages/${importSTR}/create/index.vue`),
          meta: {
            title: `${sectionConfig.name}.create`,
            permission,
            level: 'create',
            breadcrumb: [
              {
                to: { name: `${entityName}List` },
                title: `${sectionConfig.name}.list`,
              },
              {
                title: `${sectionConfig.name}.create`,
                active: true,
              },
            ],
          },
        },
        {
          path: `${entityUrl}/update/:id`,
          name: `${entityName}Update`,
          component: () => import(`@/pages/${importSTR}/update/index.vue`),
          meta: {
            title: `${sectionConfig.name}.edit`,
            permissionGroup: sectionConfig.isPermissionGroup ? sectionConfig.name : undefined,
            permission: !sectionConfig.isPermissionGroup ? permission : undefined,
            level: 'update',
            breadcrumb: [
              {
                to: { name: `${entityName}List` },
                title: `${sectionConfig.name}.list`,
              },
              {
                title: `${sectionConfig.name}.edit`,
                active: true,
              },
            ],
          },
        },
      ],
    )
  })

  return arrRouters
}
