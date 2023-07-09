import { computed, watch } from 'vue';
import store from '../../store';
const state = store.state;
export default function usAppConfig() {
    // ------------------------------------------------
    // isVerticalMenuCollapsed
    // ------------------------------------------------
    const isVerticalMenuCollapsed = computed({
        get: () => state.verticalMenuCore.isVerticalMenuCollapsed,
        set: (val) => {
            store.commit('verticalMenuCore/UPDATE_VERTICAL_MENU_COLLAPSED', val);
        },
    });
    // ------------------------------------------------
    // RTL
    // ------------------------------------------------
    const isRTL = computed({
        get: () => state.appConfigCore.layout.isRTL,
        set: (val) => {
            store.commit('appConfigCore/TOGGLE_RTL', val);
        },
    });
    // ------------------------------------------------
    // Skin
    // ------------------------------------------------
    const skin = computed({
        get: () => state.appConfigCore.layout.skin,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_SKIN', val);
        },
    });
    const skinClasses = computed(() => {
        if (skin.value === 'light')
            return 'bordered-layout';
        if (skin.value === 'dark')
            return 'dark-layout';
        // Do not return any class for dark layout because dark layout updates class in body
        // Do not return any class for light layout as that is default layout
        return null;
    });
    // ------------------------------------------------
    // routerTransition
    // ------------------------------------------------
    const routerTransition = computed({
        get: () => state.appConfigCore.layout.routerTransition,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_ROUTER_TRANSITION', val);
        },
    });
    // *===============================================---*
    // *--------- LAYOUT ---------------------------------------*
    // *===============================================---*
    // ------------------------------------------------
    // layoutType
    // ------------------------------------------------
    const layoutType = computed({
        get: () => state.appConfigCore.layout.type,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_LAYOUT_TYPE', val);
        },
    });
    // Reset skin if skin is semi-dark and move to horizontal layout
    watch(layoutType, (val) => {
        if (val === 'horizontal' && skin.value === 'semi-dark')
            skin.value = 'light';
    });
    // ------------------------------------------------
    // Content Width (Full/Boxed)
    // ------------------------------------------------
    const contentWidth = computed({
        get: () => state.appConfigCore.layout.contentWidth,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_CONTENT_WIDTH', val);
        },
    });
    // ------------------------------------------------
    // isNavMenuHidden
    // ------------------------------------------------
    const isNavMenuHidden = computed({
        get: () => state.appConfigCore.layout.menu.hidden,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_NAV_MENU_HIDDEN', val);
        },
    });
    // ------------------------------------------------
    // navMenuType
    // ------------------------------------------------
    const navMenuType = computed({
        get: () => state.appConfigCore.layout.menu.type,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_NAV_MENU_TYPE', val);
        },
    });
    const isMenuTypeAdmin = computed(() => state.appConfigCore.layout.menu.type === 'admin');
    const isMenuTypeMain = computed(() => state.appConfigCore.layout.menu.type === 'main');
    // *===============================================---*
    // *--------- NAVBAR ---------------------------------------*
    // *===============================================---*
    const navbarBackgroundColor = computed({
        get: () => state.appConfigCore.layout.navbar.backgroundColor,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_NAVBAR_CONFIG', { backgroundColor: val });
        },
    });
    const navbarType = computed({
        get: () => state.appConfigCore.layout.navbar.type,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_NAVBAR_CONFIG', { type: val });
        },
    });
    // *===============================================---*
    // *--------- FOOTER ---------------------------------------*
    // *===============================================---*
    const footerType = computed({
        get: () => state.appConfigCore.layout.footer.type,
        set: (val) => {
            store.commit('appConfigCore/UPDATE_FOOTER_CONFIG', { type: val });
        },
    });
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
    };
}
//# sourceMappingURL=useAppConfig.js.map