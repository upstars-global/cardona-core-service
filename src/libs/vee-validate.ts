import Vue from 'vue'
import { ValidationObserver, ValidationProvider, configure } from 'vee-validate'
import '../@core/utils/validations/validations'

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

configure({
  mode: 'eager',
})
