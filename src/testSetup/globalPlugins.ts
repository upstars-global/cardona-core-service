import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'

Vue.use(BootstrapVue)

import FeatherIcon from '../@core/components/feather-icon/FeatherIcon.vue'
Vue.component(FeatherIcon.name, FeatherIcon)

import '@/extensions'

import { config } from '../@vue/test-utils'
config.mocks['$t'] = (key: string) => key
