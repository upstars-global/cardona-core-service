import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { clickTrigger, setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'
import { IconsList } from '../../../src/@model/enums/icons'
import DefaultLayout from '../../../src/layouts/default.vue'

// ---------------------------------------------------------------------------
// Hoisted mock factories — must be declared before vi.mock() calls
// ---------------------------------------------------------------------------

const mockToggleSidebar = vi.hoisted(() => vi.fn())
const mockUseSidebarCollapse = vi.hoisted(() => vi.fn())
const mockUseUserStore = vi.hoisted(() => vi.fn())
const mockUseAppConfigCoreStore = vi.hoisted(() => vi.fn())

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('../../../src/layouts/default/composables/useSidebarCollapse', () => ({
  useSidebarCollapse: mockUseSidebarCollapse,
}))

vi.mock('../../../src/navigation/vertical/apps-and-pages', () => ({
  useAppsAndPages: () => ({ appsAndPages: ref([]) }),
}))

vi.mock('../../../src/stores/user', () => ({
  useUserStore: mockUseUserStore,
}))

vi.mock('../../../src/stores/appConfigCore', () => ({
  useAppConfigCoreStore: mockUseAppConfigCoreStore,
}))

vi.mock('vue-router', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    useRoute: vi.fn(() => ({ name: 'TestRoute', params: {} })),
  }
})

// ---------------------------------------------------------------------------
// Mount helpers
// ---------------------------------------------------------------------------

const getMountDefaultLayout = setMountComponent(DefaultLayout)

const global = {
  stubs: {
    VNavigationDrawer: { template: '<div><slot /></div>' },
    VMain: { template: '<div><slot /></div>' },
    PerfectScrollbar: { template: '<div><slot /></div>' },
    AppBreadcrumb: { template: '<div><slot name="content-right" :time="null" /></div>' },
    SideBar: true,
    ProductsSelect: true,
    ProjectSelect: true,
    CustomMenu: true,
    NotificationExport: true,
    RouterView: true,
    VContainer: { template: '<div><slot /></div>' },
  },
}

// ---------------------------------------------------------------------------
// Default mock return values
// ---------------------------------------------------------------------------

const mockLayoutConfigStore = { isHiddenMenu: true, isVerticalNavCollapsed: false }

beforeEach(() => {
  mockUseSidebarCollapse.mockReturnValue({
    layoutConfigStore: mockLayoutConfigStore,
    isSmallScreen: ref(false),
    isHovered: ref(false),
    isCollapsed: ref(false),
    handleMouseEnter: vi.fn(),
    handleMouseLeave: vi.fn(),
    toggleSidebar: mockToggleSidebar,
  })

  mockUseUserStore.mockReturnValue({
    projectsBySelectedProduct: [],
    isNeocore: false,
    isMarbella: false,
    selectedProjectWithoutPriority: null,
    haveSomePermissionReport: false,
    userInfo: { id: 'user-1' },
  })

  mockUseAppConfigCoreStore.mockReturnValue({ isMenuTypeMain: true })
})

afterEach(() => vi.clearAllMocks())

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DefaultLayout', () => {
  describe('Toggle sidebar icon', () => {
    it('is visible when isCollapsed=false and isSmallScreen=false (defaults)', () => {
      const wrapper = getMountDefaultLayout({}, global)

      testOn.existElement({ wrapper, testId: 'toggle-sidebar' })
    })

    it('is hidden when isCollapsed=true', () => {
      mockUseSidebarCollapse.mockReturnValue({
        layoutConfigStore: mockLayoutConfigStore,
        isSmallScreen: ref(false),
        isHovered: ref(false),
        isCollapsed: ref(true),
        handleMouseEnter: vi.fn(),
        handleMouseLeave: vi.fn(),
        toggleSidebar: mockToggleSidebar,
      })

      const wrapper = getMountDefaultLayout({}, global)

      testOn.notExistElement({ wrapper, testId: 'toggle-sidebar' })
    })

    it('is hidden when isSmallScreen=true', () => {
      mockUseSidebarCollapse.mockReturnValue({
        layoutConfigStore: mockLayoutConfigStore,
        isSmallScreen: ref(true),
        isHovered: ref(false),
        isCollapsed: ref(false),
        handleMouseEnter: vi.fn(),
        handleMouseLeave: vi.fn(),
        toggleSidebar: mockToggleSidebar,
      })

      const wrapper = getMountDefaultLayout({}, global)

      testOn.notExistElement({ wrapper, testId: 'toggle-sidebar' })
    })

    it('calls toggleSidebar when clicked', async () => {
      const wrapper = getMountDefaultLayout({}, global)

      await clickTrigger({ wrapper, testId: 'toggle-sidebar' })

      expect(mockToggleSidebar).toHaveBeenCalledOnce()
    })

    it('shows CircleDotIcon when isVerticalNavCollapsed=false', () => {
      // mockLayoutConfigStore already has isVerticalNavCollapsed: false by default
      const wrapper = getMountDefaultLayout({}, global)

      const toggleIcon = wrapper.findAllComponents({ name: 'VIcon' })
        .find(c => c.attributes('data-test-id') === 'toggle-sidebar')

      expect(toggleIcon?.props('icon')).toBe(IconsList.CircleDotIcon)
    })

    it('shows CircleIcon when isVerticalNavCollapsed=true', () => {
      mockUseSidebarCollapse.mockReturnValue({
        layoutConfigStore: { isHiddenMenu: true, isVerticalNavCollapsed: true },
        isSmallScreen: ref(false),
        isHovered: ref(false),
        isCollapsed: ref(false),
        handleMouseEnter: vi.fn(),
        handleMouseLeave: vi.fn(),
        toggleSidebar: mockToggleSidebar,
      })

      const wrapper = getMountDefaultLayout({}, global)

      const toggleIcon = wrapper.findAllComponents({ name: 'VIcon' })
        .find(c => c.attributes('data-test-id') === 'toggle-sidebar')

      expect(toggleIcon?.props('icon')).toBe(IconsList.CircleIcon)
    })
  })

  describe('NotificationExport', () => {
    it('is shown when haveSomePermissionReport=true', () => {
      mockUseUserStore.mockReturnValue({
        projectsBySelectedProduct: [],
        isNeocore: false,
        isMarbella: false,
        selectedProjectWithoutPriority: null,
        haveSomePermissionReport: true,
        userInfo: { id: 'user-1' },
      })

      const wrapper = getMountDefaultLayout({}, global)

      testOn.existElement({ wrapper, testId: 'notification-export' })
    })

    it('is hidden when haveSomePermissionReport=false (default)', () => {
      const wrapper = getMountDefaultLayout({}, global)

      testOn.notExistElement({ wrapper, testId: 'notification-export' })
    })
  })

  describe('ProjectSelect', () => {
    it('is not rendered when canSelectProject conditions are not met (default)', () => {
      // defaults: isNeocore=false, isMarbella=false, selectedProjectWithoutPriority=null
      const wrapper = getMountDefaultLayout({}, global)

      expect(wrapper.findComponent({ name: 'ProjectSelect' }).exists()).toBe(false)
    })

    it('is rendered when isNeocore=true, selectedProjectWithoutPriority is truthy, and isMenuTypeMain=true', () => {
      mockUseUserStore.mockReturnValue({
        projectsBySelectedProduct: [],
        isNeocore: true,
        isMarbella: false,
        selectedProjectWithoutPriority: { id: 'project-1' },
        haveSomePermissionReport: false,
        userInfo: { id: 'user-1' },
      })

      const wrapper = getMountDefaultLayout({}, global)

      expect(wrapper.findComponent({ name: 'ProjectSelect' }).exists()).toBe(true)
    })

    it('is rendered when isMarbella=true and isMenuTypeMain=true', () => {
      mockUseUserStore.mockReturnValue({
        projectsBySelectedProduct: [],
        isNeocore: false,
        isMarbella: true,
        selectedProjectWithoutPriority: null,
        haveSomePermissionReport: false,
        userInfo: { id: 'user-1' },
      })

      const wrapper = getMountDefaultLayout({}, global)

      expect(wrapper.findComponent({ name: 'ProjectSelect' }).exists()).toBe(true)
    })
  })
})
