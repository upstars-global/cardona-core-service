import { computed, watch } from 'vue'
import store from '@/store'

const state: any = store.state

export default function usAppConfig() {
  // ------------------------------------------------
  // isVerticalMenuCollapsed
  // ------------------------------------------------
  const isVerticalMenuCollapsed = computed({
    get: () => state.verticalMenu.isVerticalMenuCollapsed,
    set: (val) => {
      store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', val)
    },
  })

  // ------------------------------------------------
  // RTL
  // ------------------------------------------------
  const isRTL = computed({
    get: () => state.appConfig.layout.isRTL,
    set: (val) => {
      store.commit('appConfig/TOGGLE_RTL', val)
    },
  })

  // ------------------------------------------------
  // Skin
  // ------------------------------------------------
  const skin = computed({
    get: () => state.appConfig.layout.skin,
    set: (val) => {
      store.commit('appConfig/UPDATE_SKIN', val)
    },
  })

  const skinClasses = computed(() => {
    if (skin.value === 'light') return 'bordered-layout'
    if (skin.value === 'dark') return 'dark-layout'

    // Do not return any class for dark layout because dark layout updates class in body
    // Do not return any class for light layout as that is default layout
    return null
  })

  // ------------------------------------------------
  // routerTransition
  // ------------------------------------------------
  const routerTransition = computed({
    get: () => state.appConfig.layout.routerTransition,
    set: (val) => {
      store.commit('appConfig/UPDATE_ROUTER_TRANSITION', val)
    },
  })

  // *===============================================---*
  // *--------- LAYOUT ---------------------------------------*
  // *===============================================---*

  // ------------------------------------------------
  // layoutType
  // ------------------------------------------------

  const layoutType = computed({
    get: () => state.appConfig.layout.type,
    set: (val) => {
      store.commit('appConfig/UPDATE_LAYOUT_TYPE', val)
    },
  })

  // Reset skin if skin is semi-dark and move to horizontal layout
  watch(layoutType, (val) => {
    if (val === 'horizontal' && skin.value === 'semi-dark') skin.value = 'light'
  })

  // ------------------------------------------------
  // Content Width (Full/Boxed)
  // ------------------------------------------------
  const contentWidth = computed({
    get: () => state.appConfig.layout.contentWidth,
    set: (val) => {
      store.commit('appConfig/UPDATE_CONTENT_WIDTH', val)
    },
  })

  // ------------------------------------------------
  // isNavMenuHidden
  // ------------------------------------------------
  const isNavMenuHidden = computed({
    get: () => state.appConfig.layout.menu.hidden,
    set: (val) => {
      store.commit('appConfig/UPDATE_NAV_MENU_HIDDEN', val)
    },
  })

  // ------------------------------------------------
  // navMenuType
  // ------------------------------------------------
  const navMenuType = computed({
    get: () => state.appConfig.layout.menu.type,
    set: (val) => {
      store.commit('appConfig/UPDATE_NAV_MENU_TYPE', val)
    },
  })

  const isMenuTypeAdmin = computed(() => state.appConfig.layout.menu.type === 'admin')
  const isMenuTypeMain = computed(() => state.appConfig.layout.menu.type === 'main')

  // *===============================================---*
  // *--------- NAVBAR ---------------------------------------*
  // *===============================================---*

  const navbarBackgroundColor = computed({
    get: () => state.appConfig.layout.navbar.backgroundColor,
    set: (val) => {
      store.commit('appConfig/UPDATE_NAVBAR_CONFIG', { backgroundColor: val })
    },
  })

  const navbarType = computed({
    get: () => state.appConfig.layout.navbar.type,
    set: (val) => {
      store.commit('appConfig/UPDATE_NAVBAR_CONFIG', { type: val })
    },
  })

  // *===============================================---*
  // *--------- FOOTER ---------------------------------------*
  // *===============================================---*

  const footerType = computed({
    get: () => state.appConfig.layout.footer.type,
    set: (val) => {
      store.commit('appConfig/UPDATE_FOOTER_CONFIG', { type: val })
    },
  })

  return {
    isVerticalMenuCollapsed,
    isRTL,
    skin,
    skinClasses,
    routerTransition,

    // Navbar
    navbarBackgroundColor,
    navbarType,

    // Footer
    footerType,

    // Layout
    layoutType,
    contentWidth,
    isNavMenuHidden,
    navMenuType,
    isMenuTypeAdmin,
    isMenuTypeMain,
  }
}
