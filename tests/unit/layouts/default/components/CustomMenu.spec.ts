import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { clickTrigger, setMountComponent } from '../../../utils'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../../../src/@model/enums/icons'
import { Theme } from '../../../../../src/@core/enums'
import CustomMenu from '../../../../../src/layouts/default/components/CustomMenu.vue'

// ---------------------------------------------------------------------------
// vi.hoisted — all mock factories declared before vi.mock() calls
// ---------------------------------------------------------------------------

const mockRouterPush = vi.hoisted(() => vi.fn())
const mockUseUserStore = vi.hoisted(() => vi.fn())
const mockUseAppConfigCoreStore = vi.hoisted(() => vi.fn())
const mockUseAuthCoreStore = vi.hoisted(() => vi.fn())
const mockUseConfigStore = vi.hoisted(() => vi.fn())

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('../../../../../src/stores/user', () => ({
  useUserStore: mockUseUserStore,
}))

vi.mock('../../../../../src/stores/appConfigCore', () => ({
  useAppConfigCoreStore: mockUseAppConfigCoreStore,
}))

vi.mock('../../../../../src/stores/authCore', () => ({
  useAuthCoreStore: mockUseAuthCoreStore,
}))

vi.mock('../../../../../src/@core/stores/config', () => ({
  useConfigStore: mockUseConfigStore,
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: mockRouterPush,
  })),
}))

// ---------------------------------------------------------------------------
// Helpers / fixtures
// ---------------------------------------------------------------------------

const getMountCustomMenu = setMountComponent(CustomMenu)

const global = {
  stubs: {
    VMenu: {
      name: 'VMenu',
      props: ['modelValue', 'location', 'contentClass'],
      template: '<div data-stub="VMenu" :data-content-class="contentClass"><slot name="activator" :props="{}" /><slot /></div>',
    },
    VBadge: { template: '<div><slot /></div>' },
    VAvatar: { template: '<div><slot /></div>' },
    VImg: {
      name: 'VImg',
      props: ['src'],
      template: '<img data-stub="VImg" :src="src" />',
    },
    VList: { template: '<div><slot /></div>' },
    VListItem: {
      props: ['value'],
      emits: ['click'],
      template: '<div :data-value="value" @click="$emit(\'click\')"><slot name="prepend" /><slot /></div>',
    },
    VListItemTitle: { template: '<span><slot /></span>' },
    VDivider: { template: '<hr />' },
    VIcon: {
      props: ['icon'],
      template: '<i :data-icon="icon" />',
    },
  },
}

const createDefaultProps = (overrides = {}) => ({
  isCollapsedMenu: false,
  ...overrides,
})

// Store return value builders
const makeUserStore = (overrides = {}) => ({
  userInfo: { userName: 'John Doe', picture: '' },
  abilityCan: vi.fn(() => false),
  ...overrides,
})

const makeConfigStore = (theme = Theme.Light) => ({
  theme,
})

const makeAppConfigStore = () => ({
  onToggleMenuType: vi.fn(),
})

const makeAuthCoreStore = () => ({
  clearAuth: vi.fn(),
})

beforeEach(() => {
  mockUseUserStore.mockReturnValue(makeUserStore())
  mockUseConfigStore.mockReturnValue(makeConfigStore())
  mockUseAppConfigCoreStore.mockReturnValue(makeAppConfigStore())
  mockUseAuthCoreStore.mockReturnValue(makeAuthCoreStore())
})

afterEach(() => {
  vi.clearAllMocks()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CustomMenu.vue', () => {
  // -------------------------------------------------------------------------
  // Props — isCollapsedMenu
  // -------------------------------------------------------------------------
  describe('prop: isCollapsedMenu', () => {
    it('passes collapsed class to VMenu content-class when isCollapsedMenu=true', () => {
      const wrapper = getMountCustomMenu(
        createDefaultProps({ isCollapsedMenu: true }),
        global,
      )
      const menuEl = wrapper.find('[data-stub="VMenu"]')

      expect(menuEl.attributes('data-content-class')).toContain('custom-menu-popup--collapsed')
    })

    it('does not include collapsed class when isCollapsedMenu=false', () => {
      const wrapper = getMountCustomMenu(createDefaultProps(), global)
      const menuEl = wrapper.find('[data-stub="VMenu"]')

      expect(menuEl.attributes('data-content-class')).not.toContain('custom-menu-popup--collapsed')
    })
  })

  // -------------------------------------------------------------------------
  // User info — userName display
  // -------------------------------------------------------------------------
  describe('userName display', () => {
    it('renders the userName from userStore in the activator area', () => {
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      expect(wrapper.text()).toContain('John Doe')
    })

    it('renders "No name" when userInfo is null', () => {
      mockUseUserStore.mockReturnValue(makeUserStore({ userInfo: null }))
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      expect(wrapper.text()).toContain('No name')
    })

    it('renders "No name" when userName is empty', () => {
      mockUseUserStore.mockReturnValue(makeUserStore({ userInfo: { userName: '', picture: '' } }))
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      expect(wrapper.text()).toContain('No name')
    })
  })

  // -------------------------------------------------------------------------
  // Avatar — picture vs first letter
  // -------------------------------------------------------------------------
  describe('avatar display', () => {
    it('shows VImg when userAvatar (picture) is set', () => {
      mockUseUserStore.mockReturnValue(
        makeUserStore({ userInfo: { userName: 'Alice', picture: 'https://example.com/avatar.jpg' } }),
      )
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      expect(wrapper.find('[data-stub="VImg"]').exists()).toBe(true)
      // first-letter fallback must NOT be shown
      expect(wrapper.find('.first-letter').exists()).toBe(false)
    })

    it('shows the first letter of userName when no picture is set', () => {
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      const firstLetterEl = wrapper.find('.first-letter')

      expect(firstLetterEl.exists()).toBe(true)
      expect(firstLetterEl.text()).toBe('J')
    })

    it('uppercases the first letter', () => {
      mockUseUserStore.mockReturnValue(makeUserStore({ userInfo: { userName: 'alice', picture: '' } }))
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      expect(wrapper.find('.first-letter').text()).toBe('A')
    })
  })

  // -------------------------------------------------------------------------
  // Menu actions — changeMode
  // -------------------------------------------------------------------------
  describe('changeMode action', () => {
    it('shows Moon icon and dark mode title when current theme is Light', () => {
      const wrapper = getMountCustomMenu(createDefaultProps(), global)
      const icons = wrapper.findAll('i[data-icon]')

      const moonIcon = icons.find(i => i.attributes('data-icon') === IconsList.MoonIcon)

      expect(moonIcon).toBeDefined()
    })

    it('shows CloudLightning icon when current theme is Dark', () => {
      mockUseConfigStore.mockReturnValue(makeConfigStore(Theme.Dark))
      const wrapper = getMountCustomMenu(createDefaultProps(), global)
      const icons = wrapper.findAll('i[data-icon]')

      const lightIcon = icons.find(i => i.attributes('data-icon') === IconsList.CloudLightningIcon)

      expect(lightIcon).toBeDefined()
    })

    it('toggles theme to Dark when changeMode action is clicked and theme is Light', async () => {
      const configStore = { theme: Theme.Light }

      mockUseConfigStore.mockReturnValue(configStore)
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      // find the list items; changeMode is always present — it's the last action item before logout
      const listItems = wrapper.findAll('[data-value]')

      // click the last action-item that is NOT the logout row (logout has value="-1")
      const changeModeItem = listItems.find(item => item.attributes('data-value') !== '-1')

      await changeModeItem!.trigger('click')

      expect(configStore.theme).toBe(Theme.Dark)
    })
  })

  // -------------------------------------------------------------------------
  // Menu actions — superAdminMenu (canAllAdminSection)
  // -------------------------------------------------------------------------
  describe('superAdminMenu visibility', () => {
    it('does not render the admin-section item when user lacks permission', () => {
      // default: abilityCan returns false
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      // only changeMode + logout should be in the list; no CommandIcon
      const icons = wrapper.findAll('i[data-icon]')
      const commandIcon = icons.find(i => i.attributes('data-icon') === IconsList.CommandIcon)

      expect(commandIcon).toBeUndefined()
    })

    it('renders the admin-section item when user has backoffice-users-control view permission', () => {
      mockUseUserStore.mockReturnValue(makeUserStore({ abilityCan: vi.fn(() => true) }))
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      const icons = wrapper.findAll('i[data-icon]')
      const commandIcon = icons.find(i => i.attributes('data-icon') === IconsList.CommandIcon)

      expect(commandIcon).toBeDefined()
    })

    it('calls onToggleMenuType and pushes to UsersControlList on admin-section click', async () => {
      const appConfigStore = makeAppConfigStore()

      mockUseAppConfigCoreStore.mockReturnValue(appConfigStore)
      mockUseUserStore.mockReturnValue(makeUserStore({ abilityCan: vi.fn(() => true) }))

      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      // The admin item is at index 0 (first action item, value="0")
      const adminItem = wrapper.find('[data-value="0"]')

      await adminItem.trigger('click')
      await flushPromises()

      expect(appConfigStore.onToggleMenuType).toHaveBeenCalledOnce()
      expect(mockRouterPush).toHaveBeenCalledWith({ name: 'UsersControlList' })
    })
  })

  // -------------------------------------------------------------------------
  // Logout action
  // -------------------------------------------------------------------------
  describe('logout action', () => {
    it('renders the logout item with LogOutIcon', () => {
      const wrapper = getMountCustomMenu(createDefaultProps(), global)
      const icons = wrapper.findAll('i[data-icon]')
      const logoutIcon = icons.find(i => i.attributes('data-icon') === IconsList.LogOutIcon)

      expect(logoutIcon).toBeDefined()
    })

    it('calls clearAuth and navigates to /login on logout click', async () => {
      const authStore = makeAuthCoreStore()

      mockUseAuthCoreStore.mockReturnValue(authStore)

      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      const logoutItem = wrapper.find('[data-value="-1"]')

      await logoutItem.trigger('click')
      await flushPromises()

      expect(authStore.clearAuth).toHaveBeenCalledOnce()
      expect(mockRouterPush).toHaveBeenCalledWith('/login')
    })
  })

  // -------------------------------------------------------------------------
  // isVerticalNavMenuOpen inject
  // -------------------------------------------------------------------------
  describe('isVerticalNavMenuOpen inject', () => {
    it('does not crash and renders when isVerticalNavMenuOpen=true is injected', () => {
      const isMenuOpen = ref(true)
      const wrapper = getMountCustomMenu(createDefaultProps(), {
        ...global,
        provide: { isVerticalNavMenuOpen: isMenuOpen },
      })

      // The VMenu stub is rendered; the menu open state is managed by the injected ref.
      // We verify the component mounts without error and the wrapper exists.
      testOn.existElement({ wrapper, selector: '[data-stub="VMenu"]' })
    })

    it('renders without error when isVerticalNavMenuOpen is not provided (defaults to ref(false))', () => {
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      testOn.existElement({ wrapper, selector: '[data-stub="VMenu"]' })
    })
  })

  // -------------------------------------------------------------------------
  // customMenuActions list count
  // -------------------------------------------------------------------------
  describe('customMenuActions list', () => {
    it('shows 1 action item (changeMode only) when user has no admin permission', () => {
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      // action items are those with data-value !== "-1"
      const actionItems = wrapper.findAll('[data-value]').filter(
        item => item.attributes('data-value') !== '-1',
      )

      expect(actionItems).toHaveLength(1)
    })

    it('shows 2 action items (superAdmin + changeMode) when user has admin permission', () => {
      mockUseUserStore.mockReturnValue(makeUserStore({ abilityCan: vi.fn(() => true) }))
      const wrapper = getMountCustomMenu(createDefaultProps(), global)

      const actionItems = wrapper.findAll('[data-value]').filter(
        item => item.attributes('data-value') !== '-1',
      )

      expect(actionItems).toHaveLength(2)
    })
  })
})
