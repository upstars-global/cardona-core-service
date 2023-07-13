import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

// 3rd party plugins
import '../libs/portal-vue'
import '../libs/toastification'

Vue.use(BootstrapVue)

import FeatherIcon from '../@core/components/feather-icon/FeatherIcon.vue'
Vue.component(FeatherIcon.name, FeatherIcon)

import '../extensions'

import { config } from '@vue/test-utils'
import i18n from '../libs/i18n'
config.mocks['$t'] = (key: string) => i18n.t(key)
config.mocks['t'] = (key: string) => key
config.mocks['i18n'] = {
  t: (key: string) => key,
}
