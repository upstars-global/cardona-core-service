/* eslint-disable import/order */
import '@/@fake-db/db'

// import '@/@iconify/icons-bundle.ts'
import './extensions'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import vuex from '@/store'
import { initDirectives } from '@/directives'
import vSelect from 'vue-select'
import ModalPlugin from './plugins/modal'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(i18n)
app.use(vuex)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})
app.use(ModalPlugin)
initDirectives(app)
app.component('VueSelect', vSelect)

// Mount vue app
app.mount('#app')
