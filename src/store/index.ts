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
import userCore from './modules/userCore'
import users from './modules/users'
import loader from './modules/loader'
import tags from './modules/tags'

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
    userCore,
    users,
    loader,
    tags,

    app,
    'app-ecommerce': ecommerceStoreModuleCore,
  },
  strict: Boolean(process.env.DEV),
})

export const { state, getters, commit, dispatch } = store

export default store
