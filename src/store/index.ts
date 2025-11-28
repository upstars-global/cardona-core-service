import { createStore } from 'vuex'

// Modules
import appConfigCore from './modules/appConfigCore'
import verticalMenuCore from './old/verticalMenuCore'
import breakpointCore from './modules/breakpointCore'
import baseStoreCore from './modules/baseStoreCore'
import filtersCore from './modules/filtersCore'
import authCore from './old/authCore'
import compostelaCore from './modules/compostelaCore'
import baseSectionErrors from './modules/baseSectionErrors'
import demo from './modules/demo'
import permissions from './modules/permissions'
import conditions from './modules/conditions'

// import productCore from './old/productCore'
// import users from './old/users'
// import tags from './old/tags'
// import user from './old/user'

// TODO import ecommerceStoreModuleCore from '../views/apps/e-commerce/eCommerceStoreModule'
import app from './app'

const store = createStore({
  modules: {
    appConfigCore,
    verticalMenuCore,
    breakpointCore,
    baseStoreCore,
    filtersCore,
    authCore,
    compostelaCore,
    baseSectionErrors,
    demo,
    permissions,
    conditions,
    app,

    // OLD version
    // user,
    // tags,
    // users,
    // productCore,
    // TODO 'app-ecommerce': ecommerceStoreModuleCore,
  },
  strict: Boolean(process.env.DEV),
})

export default store
