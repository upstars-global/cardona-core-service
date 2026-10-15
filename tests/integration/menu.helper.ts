import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'
import SideBar from '../../src/layouts/default/components/SideBar.vue'
import { createStubbedRouter, flattenRoutes } from './router.helper'

/**
 * Checks that the sidebar menu of a product is localized.
 *
 * Users open most list pages from the sidebar. The product's menu builders hold i18n KEYS
 * (`title: 'title.gifts.listOfGifts'`), `SideBar` renders them as `t(item.title)` — a missing key does
 * not throw, the menu silently shows `title.some.key`.
 *
 * The menus are rendered by the REAL `SideBar` on a router over the product's real routes. Build each
 * menu for a user who may see everything, otherwise the permission filter hides entries.
 */

const KEY_SHAPE = /^[\w-]+(\.[\w-]+)+$/

/** The part of the product's i18n the checks use (`i18n` from its `src/plugins/i18n`). */
export interface I18nLike {
  t: (key: string) => unknown
  te: (key: string, locale?: string) => boolean
}

/** The part of the product's `MenuItem` the checks read. */
export interface MenuItemLike {
  title?: string
  heading?: string
  to?: string
  children?: MenuItemLike[]
}

export interface MenuUnderTest {

  /** Builds the menu for a user with full access. */
  build: () => MenuItemLike[]

  /** `SideBar` prop: the main menu (true) or the admin one (false). */
  isMain: boolean
}

export interface MenuEntry {

  /** i18n key the SideBar translates */
  key: string
  kind: 'heading' | 'group' | 'link'

  /** route name a link navigates to */
  to?: string
}

/** Every key the SideBar will translate. Headings that are not keys (e.g. the project name) are skipped. */
export const collectMenuEntries = (items: MenuItemLike[]): MenuEntry[] =>
  items.flatMap((item): MenuEntry[] => {
    if (item.heading)
      return KEY_SHAPE.test(item.heading) ? [{ key: item.heading, kind: 'heading' }] : []

    const own: MenuEntry[] = item.title
      ? [{ key: item.title, kind: item.children ? 'group' : 'link', to: item.to }]
      : []

    return [...own, ...collectMenuEntries(item.children ?? [])]
  })

const renderSideBar = async (routes: RouteRecordRaw[], items: MenuItemLike[], isMenuTypeMain: boolean) => {
  const router = createStubbedRouter(routes)

  await router.push('/')

  const wrapper = mount(SideBar, { props: { items, isCollapsed: false, isMenuTypeMain }, global: { plugins: [router] } })

  await flushPromises()

  return wrapper
}

export interface MenuLocalizationOptions {
  menus: Record<string, MenuUnderTest>

  /** The product's i18n (`src/plugins/i18n`) — it holds the product's own messages, the core's copy does not. */
  i18n: I18nLike

  /** The product's routes: link targets are checked against them and the router is built from them. */
  routes: RouteRecordRaw[]
}

/** Whole menu, once: every heading, group and link is a real key, rendered translated, and points to a route. */
export const describeMenuLocalization = ({ menus, routes, i18n }: MenuLocalizationOptions) => {
  const exists = (key: string) => i18n.te(key, 'en')

  describe.each(Object.entries(menus))('%s sidebar menu', (_, { build, isMain }) => {
    const entries = collectMenuEntries(build())

    it('has entries (the check itself is not vacuous)', () => {
      expect(entries.filter(({ kind }) => kind === 'link').length, 'links').toBeGreaterThan(0)
    })

    it('every link navigates to an existing route', () => {
      const routeNames = new Set(flattenRoutes(routes).map(({ name }) => String(name)))
      const dead = entries.filter(({ kind, to }) => kind === 'link' && to && !routeNames.has(to)).map(({ key, to }) => `${key}  →  ${to}`)

      expect(dead, 'sidebar links to routes that do not exist (they render with an empty href)').toEqual([])
    })

    it('every title and heading key exists in the en messages', () => {
      const missing = entries.filter(({ key }) => !exists(key)).map(({ key, to }) => `${key}${to ? `  →  ${to}` : ''}`)

      expect(missing, 'menu keys missing from en').toEqual([])
    })

    it('SideBar renders every entry translated, never as a raw key', async () => {
      const text = (await renderSideBar(routes, build(), isMain)).text()

      expect(entries.filter(({ key }) => !text.includes(String(i18n.t(key)))).map(({ key }) => key), 'not rendered').toEqual([])
      expect(entries.filter(({ key }) => text.includes(key)).map(({ key }) => key), 'raw keys on screen').toEqual([])
    })
  })
}

/** One list page: the sidebar has a link to it and that link is localized. */
export const describeListMenuEntry = ({ routeName, menus, routes, i18n }: MenuLocalizationOptions & { routeName: string }) => {
  const exists = (key: string) => i18n.te(key, 'en')

  describe(`${routeName} sidebar entry`, () => {
    const links = Object.values(menus)
      .flatMap(menu => collectMenuEntries(menu.build()).filter(({ to }) => to === routeName).map(entry => ({ entry, menu })))

    it('is reachable from the sidebar', () => {
      expect(links.length, `no sidebar link navigates to ${routeName}`).toBeGreaterThan(0)
    })

    it.runIf(links.length > 0)('its title is a real key and is rendered translated', async () => {
      for (const { entry, menu } of links) {
        const text = (await renderSideBar(routes, menu.build(), menu.isMain)).text()

        expect(exists(entry.key), `${entry.key} is missing from en`).toBe(true)
        expect(text, `"${i18n.t(entry.key)}" is not rendered`).toContain(String(i18n.t(entry.key)))
        expect(text, `raw key ${entry.key} on screen`).not.toContain(entry.key)
      }
    })
  })
}
