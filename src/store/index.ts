import { createStore } from 'vuex'

// Modules
// import compostelaCore from './old/compostelaCore'
// import filtersCore from './old/filtersCore'
// import baseSectionErrors from './old/baseSectionErrors'
// import conditions from './old/conditions'
// import authCore from './old/authCore'
// import demo from './old/demo'
// import appConfigCore from './old/appConfigCore'
// import verticalMenuCore from './old/verticalMenuCore'
// import breakpointCore from './old/breakpointCore'
// import baseStoreCore from './old/baseStoreCore'
// import productCore from './old/productCore'
// import users from './old/users'
// import tags from './old/tags'
// import user from './old/user'

// TODO import ecommerceStoreModuleCore from '../views/apps/e-commerce/eCommerceStoreModule'
import app from './app'

const store = createStore({
  modules: {
    app,

    // OLD version
    // permissions,
    // compostelaCore,
    // filtersCore,
    // baseSectionErrors,
    // conditions,
    // appConfigCore,
    // verticalMenuCore,
    // breakpointCore,
    // baseStoreCore,
    // demo,
    // authCore,
    // user,
    // tags,
    // users,
    // productCore,
    // TODO 'app-ecommerce': ecommerceStoreModuleCore,
  },
  strict: Boolean(process.env.DEV),
})

export default store
