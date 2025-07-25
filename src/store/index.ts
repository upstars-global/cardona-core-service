import { createStore } from 'vuex'

// Modules
import appConfigCore from './modules/appConfigCore'
import verticalMenuCore from './modules/verticalMenuCore'
import breakpointCore from './modules/breakpointCore'
import baseStoreCore from './modules/baseStoreCore'
import productCore from './modules/productCore'
import filtersCore from './modules/filtersCore'
import authCore from './modules/authCore'
import compostelaCore from './modules/compostelaCore'
import user from './modules/user'
import users from './modules/users'
import baseSectionErrors from './modules/baseSectionErrors'
import tags from './modules/tags'
import demo from './modules/demo'
import permissions from './modules/permissions'
import conditions from './modules/conditions'

// TODO import ecommerceStoreModuleCore from '../views/apps/e-commerce/eCommerceStoreModule'
import app from './app'

const store = createStore({
  modules: {
    appConfigCore,
    verticalMenuCore,
    breakpointCore,
    baseStoreCore,
    productCore,
    filtersCore,
    authCore,
    compostelaCore,
    user,
    users,
    baseSectionErrors,
    tags,
    demo,
    permissions,
    conditions,
    app,

    // TODO 'app-ecommerce': ecommerceStoreModuleCore,
  },
  strict: Boolean(process.env.DEV),
})

export default store
