import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { clickTrigger, setMountComponent } from '../../../utils'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import SideBar from '../../../../../src/layouts/default/components/SideBar.vue'

// ---------------------------------------------------------------------------
// vi.hoisted — all mock factories must be declared here so they are available
// before the vi.mock() calls that reference them.
// ---------------------------------------------------------------------------

const mockRouterPush = vi.hoisted(() => vi.fn())
const mockOnToggleMenuType = vi.hoisted(() => vi.fn())
const mockUseNavGroups = vi.hoisted(() => vi.fn())
const mockUseAppConfigCoreStore = vi.hoisted(() => vi.fn())
const mockGetComputedNavLinkToProp = vi.hoisted(() => vi.fn())
const mockIsNavLinkActive = vi.hoisted(() => vi.fn(() => false))
const mockIsNavGroupActive = vi.hoisted(() => vi.fn(() => false))

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('../../../../../src/layouts/default/composables/useNavGroups', () => ({
  useNavGroups: mockUseNavGroups,
}))

vi.mock('../../../../../src/stores/appConfigCore', () => ({
  useAppConfigCoreStore: mockUseAppConfigCoreStore,
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: mockRouterPush,
    currentRoute: { value: { matched: [] } },
    getRoutes: vi.fn(() => []),
  })),
  useRoute: vi.fn(() => ({ name: 'TestRoute', params: {}, path: '/' })),
  RouterLink: { template: '<a><slot /></a>' },
}))

vi.mock('../../../../../src/@layouts/utils', () => ({
  getComputedNavLinkToProp: { value: mockGetComputedNavLinkToProp },
  isNavLinkActive: mockIsNavLinkActive,
  isNavGroupActive: mockIsNavGroupActive,
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const headingItem = { heading: 'menu.general' }
const linkItem = { title: 'menu.dashboard', to: 'dashboard', icon: { icon: 'tabler-dashboard' } }

const groupItem = {
  title: 'menu.apps',
  icon: { icon: 'tabler-apps' },
  children: [
    { title: 'menu.email', to: 'email' },
  ],
}

// ---------------------------------------------------------------------------
// Mount factory
// ---------------------------------------------------------------------------

const getMountSideBar = setMountComponent(SideBar)

const createDefaultProps = (overrides = {}) => ({
  items: [],
  isCollapsed: false,
  isMenuTypeMain: true,
  ...overrides,
})

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('SideBar.vue', () => {
  beforeEach(() => {
    mockUseNavGroups.mockReturnValue({ opened: ref([]) })
    mockUseAppConfigCoreStore.mockReturnValue({ onToggleMenuType: mockOnToggleMenuType })
    mockGetComputedNavLinkToProp.mockReturnValue({ to: '/dashboard', href: null, target: null })
  })

  afterEach(() => vi.clearAllMocks())

  // -------------------------------------------------------------------------
  // back-btn visibility
  // -------------------------------------------------------------------------

  it('shows back-btn when isMenuTypeMain is false', () => {
    const wrapper = getMountSideBar(createDefaultProps({ isMenuTypeMain: false }))

    testOn.existElement({ wrapper, testId: 'back-btn' })
  })

  it('hides back-btn when isMenuTypeMain is true (default)', () => {
    const wrapper = getMountSideBar(createDefaultProps({ isMenuTypeMain: true }))

    testOn.notExistElement({ wrapper, testId: 'back-btn' })
  })

  // -------------------------------------------------------------------------
  // back-btn click
  // -------------------------------------------------------------------------

  it('calls onToggleMenuType when back-btn is clicked', async () => {
    const wrapper = getMountSideBar(createDefaultProps({ isMenuTypeMain: false }))

    // VBtn with a :to prop renders via RouterLink (mocked as <a>). Click the first
    // focusable element (button or anchor) inside the back-btn container, falling
    // back to the container itself so the event bubbles to the component handler.
    const backBtnContainer = wrapper.find('[data-test-id="back-btn"]')

    const clickable = backBtnContainer.find('button, a').exists()
      ? backBtnContainer.find('button, a')
      : backBtnContainer

    await clickable.trigger('click')

    expect(mockOnToggleMenuType).toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // Item rendering
  // -------------------------------------------------------------------------

  it('renders one nav-heading when items contains a heading item', () => {
    const wrapper = getMountSideBar(createDefaultProps({ items: [headingItem] }))

    testOn.checkLengthElements({ wrapper, testId: 'nav-heading', all: true }, 1)
  })

  it('renders one nav-group when items contains a group item', () => {
    const wrapper = getMountSideBar(createDefaultProps({ items: [groupItem] }))

    testOn.checkLengthElements({ wrapper, testId: 'nav-group', all: true }, 1)
  })

  it('renders one nav-link when items contains a link item', () => {
    const wrapper = getMountSideBar(createDefaultProps({ items: [linkItem] }))

    testOn.checkLengthElements({ wrapper, testId: 'nav-link', all: true }, 1)
  })

  it('renders one nav-child-link when items contains a group with one child', () => {
    const wrapper = getMountSideBar(createDefaultProps({ items: [groupItem] }))

    testOn.checkLengthElements({ wrapper, testId: 'nav-child-link', all: true }, 1)
  })

  // -------------------------------------------------------------------------
  // Multiple item types rendered together
  // -------------------------------------------------------------------------

  it('renders heading, group, and link all together when items contains all three types', () => {
    const wrapper = getMountSideBar(
      createDefaultProps({ items: [headingItem, groupItem, linkItem] }),
    )

    testOn.checkLengthElements({ wrapper, testId: 'nav-heading', all: true }, 1)
    testOn.checkLengthElements({ wrapper, testId: 'nav-group', all: true }, 1)
    testOn.checkLengthElements({ wrapper, testId: 'nav-link', all: true }, 1)
    testOn.checkLengthElements({ wrapper, testId: 'nav-child-link', all: true }, 1)
  })
})
