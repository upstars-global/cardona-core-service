import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appConfigCore from './app-config/index'
import verticalMenuCore from './modules/verticalMenu'
import breakpointCore from './modules/breakpoint'
import localeCore from './modules/locale'
import baseStoreCore from './modules/baseStore'
import productCore from './modules/product'
import filtersCore from './modules/filters'
import authCore from './modules/auth'
import compostelaCore from './modules/compostela'

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

    app,
    'app-ecommerce': ecommerceStoreModuleCore,
  },
  strict: Boolean(process.env.DEV),
})

export const { state, getters, commit, dispatch } = store

export default store
