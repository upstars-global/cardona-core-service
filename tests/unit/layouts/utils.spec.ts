import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { resolveNavLinkRouteName, safeResolveRoute } from '../../../src/@layouts/utils'

const component = { template: '<div />' }

const createTestRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'Login', component },
      { path: '/payouts', name: 'PayoutsList', component },
      { path: '/:project/support-service', name: 'SupportService', component },
    ],
  })

describe('safeResolveRoute', () => {
  let router: ReturnType<typeof createTestRouter>

  beforeEach(() => {
    router = createTestRouter()
  })

  it('resolves a param-less route to its path', async () => {
    await router.push('/login')

    expect(safeResolveRoute(router, { name: 'PayoutsList' })?.fullPath).toBe('/payouts')
  })

  it('takes a missing param from the current route', async () => {
    await router.push('/acme/support-service')

    expect(safeResolveRoute(router, { name: 'SupportService' })?.fullPath).toBe('/acme/support-service')
  })

  it('returns undefined when the current route has no param the target needs', async () => {
    await router.push('/login')

    expect(safeResolveRoute(router, { name: 'SupportService' })).toBeUndefined()
  })

  it('returns undefined for an unknown route name', async () => {
    await router.push('/login')

    expect(safeResolveRoute(router, { name: 'NoSuchRoute' })).toBeUndefined()
  })

  it('keeps query and hash in the resolved path', async () => {
    await router.push('/login')

    const resolved = safeResolveRoute(router, { name: 'PayoutsList', query: { status: 'new' }, hash: '#tab' })

    expect(resolved?.fullPath).toBe('/payouts?status=new#tab')
  })
})

describe('resolveNavLinkRouteName', () => {
  let router: ReturnType<typeof createTestRouter>

  beforeEach(() => {
    router = createTestRouter()
  })

  it('returns a string target as the route name', () => {
    expect(resolveNavLinkRouteName({ title: 'payouts', to: 'PayoutsList' }, router)).toBe('PayoutsList')
  })

  it('returns the name of a resolvable object target', async () => {
    await router.push('/acme/support-service')

    expect(resolveNavLinkRouteName({ title: 'support', to: { name: 'SupportService' } }, router)).toBe('SupportService')
  })

  it('returns null instead of throwing when the target cannot be resolved', async () => {
    await router.push('/login')

    expect(resolveNavLinkRouteName({ title: 'support', to: { name: 'SupportService' } }, router)).toBeNull()
  })

  it('returns null when there is no target', () => {
    expect(resolveNavLinkRouteName({ title: 'heading' }, router)).toBeNull()
  })
})
