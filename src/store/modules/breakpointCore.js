import { $themeBreakpoints } from '@themeConfig';
export default {
    namespaced: true,
    state: {
        windowWidth: 0,
        shallShowOverlay: false,
        mobileDevices: ['xs', 'sm'],
        portableDevices: ['xs', 'sm', 'md'],
    },
    getters: {
        currentBreakPoint: ({ windowWidth }) => {
            if (windowWidth >= $themeBreakpoints.xl)
                return 'xl';
            if (windowWidth >= $themeBreakpoints.lg)
                return 'lg';
            if (windowWidth >= $themeBreakpoints.md)
                return 'md';
            if (windowWidth >= $themeBreakpoints.sm)
                return 'sm';
            return 'xs';
        },
        isTabletDevice: (state, { currentBreakPoint }) => currentBreakPoint === 'md',
        isMobileDevice: ({ mobileDevices }, { currentBreakPoint }) => mobileDevices.includes(currentBreakPoint),
        isPortableDevice: ({ portableDevices }, { currentBreakPoint }) => portableDevices.includes(currentBreakPoint),
    },
    mutations: {
        UPDATE_WINDOW_WIDTH(state, width) {
            state.windowWidth = width;
        },
        TOGGLE_OVERLAY(state, val) {
            state.shallShowOverlay = val !== undefined ? val : !state.shallShowOverlay;
        },
    },
};
//# sourceMappingURL=breakpointCore.js.map