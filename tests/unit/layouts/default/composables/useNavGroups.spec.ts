import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref, type Ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { useNavGroups } from '../../../../../src/layouts/default/composables/useNavGroups'

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------

const mockIsNavGroupActive = vi.hoisted(() => vi.fn(() => false))

vi.mock('../../../../../src/@layouts/utils', () => ({
  isNavGroupActive: mockIsNavGroupActive,
}))

let mockRoutePath = '/'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ path: mockRoutePath })),
  useRouter: vi.fn(() => ({
    currentRoute: { value: { matched: [] } },
  })),
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const groupA = {
  title: 'menu.players',
  icon: { icon: 'tabler-users' },
  children: [{ title: 'menu.player-list', to: 'players-list' }],
}

const groupB = {
  title: 'menu.games',
  icon: { icon: 'tabler-gamepad' },
  children: [{ title: 'menu.game-list', to: 'games-list' }],
}

const defaultItems = [groupA, groupB]

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function mountComposable(opts: {
  navItems?: typeof defaultItems
  isCollapsed?: Ref<boolean>
  isMenuTypeMain?: Ref<boolean>
} = {}) {
  const {
    navItems = defaultItems,
    isCollapsed = ref(false),
    isMenuTypeMain = ref(true),
  } = opts

  const TestComponent = defineComponent({
    setup() {
      const { opened } = useNavGroups(
        () => navItems,
        () => isCollapsed.value,
        () => isMenuTypeMain.value,
      )

      return {
        opened,
        setOpened: (val: string[]) => { opened.value = val },
      }
    },
    template: '<div />',
  })

  return { wrapper: mount(TestComponent), isCollapsed, isMenuTypeMain }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useNavGroups', () => {
  beforeEach(() => {
    mockRoutePath = '/'
    mockIsNavGroupActive.mockReturnValue(false)
  })

  afterEach(() => vi.clearAllMocks())

  // -------------------------------------------------------------------------
  // Immediate route watch — initial open state
  // -------------------------------------------------------------------------

  describe('immediate route watch', () => {
    it('opens the group whose children match the current route', () => {
      mockIsNavGroupActive.mockImplementation(children => children === groupA.children)

      const { wrapper } = mountComposable()

      expect(wrapper.vm.opened).toEqual([groupA.title])
    })

    it('collapses all groups when no nav group matches the current route', () => {
      mockIsNavGroupActive.mockReturnValue(false)

      const { wrapper } = mountComposable()

      expect(wrapper.vm.opened).toEqual([])
    })

    it('opens multiple groups when several match the current route', () => {
      mockIsNavGroupActive.mockReturnValue(true)

      const { wrapper } = mountComposable()

      expect(wrapper.vm.opened).toEqual([groupA.title, groupB.title])
    })
  })

  // -------------------------------------------------------------------------
  // Navigation to create/edit page (fix: BAC-7722)
  // Menu groups must collapse when navigating to a page not in the nav tree
  // -------------------------------------------------------------------------

  describe('navigation to create/edit page', () => {
    it('collapses all groups after navigating from a list page to a create/edit page', () => {
      mockIsNavGroupActive.mockReturnValue(true)
      mockRoutePath = '/players'
      const { wrapper: listWrapper } = mountComposable()

      expect(listWrapper.vm.opened).toEqual([groupA.title, groupB.title])
      listWrapper.unmount()

      mockIsNavGroupActive.mockReturnValue(false)
      mockRoutePath = '/players/create'
      const { wrapper: createWrapper } = mountComposable()

      expect(createWrapper.vm.opened).toEqual([])
    })
  })

  // -------------------------------------------------------------------------
  // isCollapsed
  // -------------------------------------------------------------------------

  describe('isCollapsed', () => {
    it('returns empty array even when active groups exist', () => {
      mockIsNavGroupActive.mockReturnValue(true)

      const { wrapper } = mountComposable({ isCollapsed: ref(true) })

      expect(wrapper.vm.opened).toEqual([])
    })

    it('returns active groups when not collapsed', () => {
      mockIsNavGroupActive.mockImplementation(children => children === groupA.children)

      const { wrapper } = mountComposable({ isCollapsed: ref(false) })

      expect(wrapper.vm.opened).toEqual([groupA.title])
    })

    it('ignores setOpened call and keeps opened empty when collapsed', async () => {
      const { wrapper } = mountComposable({ isCollapsed: ref(true) })

      wrapper.vm.setOpened([groupA.title])
      await nextTick()

      expect(wrapper.vm.opened).toEqual([])
    })
  })

  // -------------------------------------------------------------------------
  // isMenuTypeMain watch
  // -------------------------------------------------------------------------

  describe('isMenuTypeMain watch', () => {
    it('opens the first nav group when isMenuTypeMain becomes true', async () => {
      const isMenuTypeMain = ref(false)
      const { wrapper } = mountComposable({ isMenuTypeMain })

      isMenuTypeMain.value = true
      await flushPromises()

      expect(wrapper.vm.opened).toEqual([groupA.title])
    })

    it('does not change opened state when isMenuTypeMain becomes false', async () => {
      mockIsNavGroupActive.mockImplementation(children => children === groupA.children)
      const isMenuTypeMain = ref(true)
      const { wrapper } = mountComposable({ isMenuTypeMain })

      expect(wrapper.vm.opened).toEqual([groupA.title])

      isMenuTypeMain.value = false
      await nextTick()

      expect(wrapper.vm.opened).toEqual([groupA.title])
    })
  })

  // -------------------------------------------------------------------------
  // opened setter — accordion behavior
  // -------------------------------------------------------------------------

  describe('opened setter', () => {
    it('keeps the active group open when a new group is opened', async () => {
      mockIsNavGroupActive.mockImplementation(children => children === groupA.children)
      const { wrapper } = mountComposable()

      expect(wrapper.vm.opened).toEqual([groupA.title])

      wrapper.vm.setOpened([groupA.title, groupB.title])
      await nextTick()

      expect(wrapper.vm.opened).toContain(groupA.title)
      expect(wrapper.vm.opened).toContain(groupB.title)
    })

    it('closes a group when it is removed from the opened list', async () => {
      const { wrapper } = mountComposable()

      wrapper.vm.setOpened([groupA.title])
      await nextTick()
      expect(wrapper.vm.opened).toEqual([groupA.title])

      wrapper.vm.setOpened([])
      await nextTick()

      expect(wrapper.vm.opened).toEqual([])
    })

    it('opens only the first of multiple newly added groups', async () => {
      const { wrapper } = mountComposable()

      wrapper.vm.setOpened([groupA.title, groupB.title])
      await nextTick()

      expect(wrapper.vm.opened).toEqual([groupA.title])
    })
  })
})