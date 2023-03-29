import Vue from 'vue'
import FeatherIcon from './@core/components/feather-icon/FeatherIcon.vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'

Ripple.color = 'rgba(255, 255, 255, 0.35)'
Vue.directive('ripple', Ripple)
// @ts-ignore
Vue.component('VSelect', vSelect)

Vue.component(FeatherIcon.name, FeatherIcon)
