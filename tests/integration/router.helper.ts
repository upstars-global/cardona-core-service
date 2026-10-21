import type { RouteRecordRaw } from 'vue-router'
import { createMemoryHistory, createRouter } from 'vue-router'

/** The route list with `children` flattened, so nested routes are checked like top-level ones. */
export const flattenRoutes = (routes: RouteRecordRaw[]): RouteRecordRaw[] =>
  routes.flatMap(route => [route, ...flattenRoutes(route.children ?? [])])

/** Identifier for reports: the route name, or the path for an unnamed one (the catch-all). */
export const routeId = ({ name, path }: RouteRecordRaw) => String(name ?? path)

/**
 * A router over the product's real routes, with page components stubbed.
 *
 * Layout components (header, sidebar) only read route names, paths and meta. Real page components are
 * lazy imports that pull whole pages in (stores, filters, …) and are loaded on navigation, so they are
 * swapped for an empty one — everything else stays exactly as the product defines it.
 */
export const createStubbedRouter = (routes: RouteRecordRaw[]) =>
  createRouter({
    history: createMemoryHistory(),
    routes: flattenRoutes(routes).map(route => ({
      ...Object.fromEntries(Object.entries(route).filter(([key]) => key !== 'children')),
      component: { render: () => null },
    }) as RouteRecordRaw),
  })
