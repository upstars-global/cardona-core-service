// Theme Colors
// Initially this will be blank. Later on when app is initialized we will assign bootstrap colors to this from CSS variables.
export const $themeColors = {};
// App Breakpoints
// Initially this will be blank. Later on when app is initialized we will assign bootstrap breakpoints to this object from CSS variables.
export const $themeBreakpoints = {};
// APP CONFIG
export const $themeConfig = {
    app: {
        appName: 'сardona-core-service',
        // eslint-disable-next-line global-require
        appLogoImage: require('@/assets/images/logo/logo.svg'), // Will update logo in navigation menu (Branding)
    },
    layout: {
        isRTL: false,
        skin: 'light',
        routerTransition: 'zoom-fade',
        type: 'vertical',
        contentWidth: 'full',
        menu: {
            type: 'main',
            hidden: false,
            isCollapsed: false,
        },
        navbar: {
            // ? For horizontal menu, navbar type will work for navMenu type
            type: 'floating',
            backgroundColor: '', // BS color options [primary, success, etc]
        },
        footer: {
            type: 'static', // static, sticky, hidden
        },
        customizer: true,
        enableScrollToTop: true,
    },
};
//# sourceMappingURL=themeConfig.js.map