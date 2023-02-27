import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'

import router from './router'
import store from './store'
import App from './App.vue'

import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'
import '@/extensions'
import '@core/directives/date'
import '@core/directives/currency'
import '@/libs/vee-validate'
import '@/libs/bootstrap-vue'
import '@/libs/froala'
import i18n from '@/libs/i18n'

// Axios Mock Adapter
import '@/@fake-db/db'

// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
