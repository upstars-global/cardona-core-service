import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appConfig from './app-config/index'
import verticalMenu from './modules/verticalMenu'
import breakpoint from './modules/breakpoint'
import locale from './modules/locale'
import baseStore from './modules/baseStore'
import product from './modules/product'
import filters from './modules/filters'
import auth from './modules/auth'
import compostela from './modules/compostela'

import ecommerceStoreModule from '../views/apps/e-commerce/eCommerceStoreModule'
import app from './app'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    appConfig,
    verticalMenu,
    breakpoint,
    locale,
    baseStore,
    product,
    filters,
    auth,
    compostela,

    app,
    'app-ecommerce': ecommerceStoreModule,
  },
  strict: Boolean(process.env.DEV),
})

export const { state, getters, commit, dispatch } = store

export default store
