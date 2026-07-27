import type { RouteLocationNormalized } from 'vue-router'
import { kebabCase, uniq } from 'lodash'
import type { IRouterConfig } from '../@model/router'
import { convertCamelCase } from '../helpers/index'
import { PermissionLevel } from '../@model/permission'
import { permissionPrefix } from '@productConfig'
import type { PermissionType } from '@permissions'

export const useRedirectToNotFoundPage = router => async (errorType: string): Promise<boolean> => {
  if (errorType === 'NOT_FOUND') {
    await router.push({ name: 'NotFound' })

    return true
  }

  return false
}
type PagesGlob = Record<string, () => Promise<unknown>>
type ComponentResolver = (path: string) => () => Promise<unknown>

interface BuildRouteArgs {
  importSTR: string
  entityUrl: string
  entityName: string
  permission: PermissionType | PermissionType[]
  sectionConfig: IRouterConfig
  prefixName: string
  componentResolver: ComponentResolver
}

function permissionGroupMeta({ permission, sectionConfig }: BuildRouteArgs) {
  return {
    permissionGroup: sectionConfig.isPermissionGroup ? sectionConfig.name : undefined,
    permission: !sectionConfig.isPermissionGroup ? permission : undefined,
  }
}

function backBreadcrumb({ prefixName, entityName, sectionConfig }: BuildRouteArgs, titleKey: string) {
  return [
    { to: { name: `${prefixName}${entityName}List` }, title: `${getPrefixNameKey(prefixName, sectionConfig.name)}.list` },
    { title: `${getPrefixNameKey(prefixName, sectionConfig.name)}.${titleKey}`, active: true },
  ]
}

const getPrefixNameKey = (prefixName: string, name: string) =>
  prefixName
    ? prefixName.charAt(0).toLowerCase() + prefixName.slice(1) + name.charAt(0).toUpperCase() + name.slice(1)
    : name

function getCommonProps(sectionConfig: IRouterConfig, componentResolver: ComponentResolver): BuildRouteArgs {
  let importSTR = sectionConfig.isConvertName
    ? convertCamelCase(sectionConfig.name, '/')
    : sectionConfig.name

  if (sectionConfig.sectionName)
    importSTR = `${sectionConfig.sectionName}/${importSTR}`

  const entityUrl = getEntityUrl(importSTR, sectionConfig)
  const entityName = sectionConfig.name[0].toUpperCase() + sectionConfig.name.slice(1)
  const permission: PermissionType | PermissionType[] = sectionConfig.permission || `${permissionPrefix}-${convertCamelCase(sectionConfig.name, '-')}`
  const prefixName = sectionConfig.prefixName || ''

  return { importSTR, entityUrl, entityName, permission, sectionConfig, prefixName, componentResolver }
}

const buildListRoute = ({
  importSTR, entityUrl, entityName, permission, sectionConfig, prefixName, componentResolver,
}: BuildRouteArgs) => ({
  path: entityUrl,
  name: `${prefixName}${entityName}List`,
  component: componentResolver(`${importSTR}/list/index.vue`),
  meta: {
    title: `${getPrefixNameKey(prefixName, sectionConfig.name)}.list`,
    permission,
    breadcrumb: [{ title: `${getPrefixNameKey(prefixName, sectionConfig.name)}.list`, active: true }],
  },
})

const buildCreateRoute = (args: BuildRouteArgs) => ({
  path: `${args.entityUrl}/create/:type?/:id?`,
  name: `${args.prefixName}${args.entityName}Create`,
  component: args.componentResolver(`${args.importSTR}/create/index.vue`),
  meta: {
    title: `${getPrefixNameKey(args.prefixName, args.sectionConfig.name)}.create`,
    permission: args.permission,
    level: PermissionLevel.create,
    breadcrumb: backBreadcrumb(args, 'create'),
  },
})

const buildUpdateRoute = (args: BuildRouteArgs) => ({
  path: `${args.entityUrl}/update/:id`,
  name: `${args.prefixName}${args.entityName}Update`,
  component: args.componentResolver(`${args.importSTR}/update/index.vue`),
  meta: {
    title: `${getPrefixNameKey(args.prefixName, args.sectionConfig.name)}.edit`,
    ...permissionGroupMeta(args),
    breadcrumb: backBreadcrumb(args, 'edit'),
  },
})

const buildCardRoute = (args: BuildRouteArgs) => ({
  path: `${args.entityUrl}/card/:id`,
  name: `${args.prefixName}${args.entityName}Card`,
  component: args.componentResolver(`${args.importSTR}/card/index.vue`),
  meta: {
    title: `${getPrefixNameKey(args.prefixName, args.sectionConfig.name)}.card`,
    ...permissionGroupMeta(args),
    level: PermissionLevel.view,
    breadcrumb: backBreadcrumb(args, 'card'),
  },
})

const buildSingleRoute = (args: BuildRouteArgs) => ({
  path: args.entityUrl,
  name: `${args.prefixName}${args.entityName}`,
  component: args.componentResolver(`${args.importSTR}/index.vue`),
  meta: {
    title: args.sectionConfig.name,
    ...permissionGroupMeta(args),
    breadcrumb: [{ title: `${getPrefixNameKey(args.prefixName, args.sectionConfig.name)}`, active: true }],
  },
})

export default function sectionRouterGenerator(sectionConfigs: Array<IRouterConfig>) {
  const pages = import.meta.glob('/src/pages/**/*.vue') as PagesGlob
  const componentResolver: ComponentResolver = path => pages[`/src/pages/${path}`]

  return sectionConfigs.flatMap((sectionConfig: IRouterConfig) => {
    const buildRouteArgs = getCommonProps(sectionConfig, componentResolver)

    if (sectionConfig.isSingleRoute)
      return buildSingleRoute(buildRouteArgs)

    const routes = [
      buildListRoute(buildRouteArgs),
      buildCreateRoute(buildRouteArgs),
      buildUpdateRoute(buildRouteArgs),
    ]

    if (sectionConfig.withCard)
      routes.push(buildCardRoute(buildRouteArgs))

    return routes
  })
}

const getEntityUrl = (importSTR: string, sectionConfig: IRouterConfig): string => {
  const generatedUrl = sectionConfig.sectionName && sectionConfig.withoutSectionNameInUrl ? importSTR.replace(`/${sectionConfig.sectionName}`, '') : importSTR
  const urlParts = uniq(generatedUrl.split('/'))
  const baseUrl = urlParts.map(part => kebabCase(part)).join('/')

  return sectionConfig.isProject === false ? `/${baseUrl}` : `/:project/${baseUrl}`
}

export const useScrollBehaviorOfRouter = () => {
  const actualNameOfRoute = ref<string>('')

  const scrollBehavior = (to: RouteLocationNormalized) => {
    if (to.name !== actualNameOfRoute.value || to.query.perPage) {
      actualNameOfRoute.value = to?.name?.toString()

      return { behavior: 'smooth', top: 0 }
    }
  }

  return { scrollBehavior }
}
