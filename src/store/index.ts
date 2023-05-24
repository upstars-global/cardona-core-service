import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appConfigCore from './modules/appConfigCore'
import verticalMenuCore from './modules/verticalMenuCore'
import breakpointCore from './modules/breakpointCore'
import localeCore from './modules/localeCore'
import baseStoreCore from './modules/baseStoreCore'
import productCore from './modules/productCore'
import filtersCore from './modules/filtersCore'
import authCore from './modules/authCore'
import compostelaCore from './modules/compostelaCore'
import user from './modules/user'
import users from './modules/users'
import loader from './modules/loader'
import tags from './modules/tags'
import demo from './modules/demo'

import ecommerceStoreModuleCore from '../views/apps/e-commerce/eCommerceStoreModule'
import app from './app'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    appConfigCore,
    verticalMenuCore,
    breakpointCore,
    localeCore,
    baseStoreCore,
    productCore,
    filtersCore,
    authCore,
    compostelaCore,
    user,
    users,
    loader,
    tags,
    demo,
    app,
    'app-ecommerce': ecommerceStoreModuleCore,
  },
  strict: Boolean(process.env.DEV),
})

export default store
