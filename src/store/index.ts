import Vue from 'vue'
import Vuex from 'vuex'

// Modules
import appConfig from './modules/appConfig'
import verticalMenu from './modules/verticalMenu'
import breakpoint from './modules/breakpoint'
import locale from './modules/locale'
import baseStore from './modules/baseStore'
import product from './modules/product'
import filters from './modules/filters'

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
  },
  strict: Boolean(process.env.DEV),
})

export const { state, getters, commit, dispatch } = store

export default store
