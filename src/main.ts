import { createApp } from 'vue'

import '@/@fake-db/db'
import './@model/validations'
import './extensions'
import VueFroala from './libs/froala'
import { initDirectives } from '@/directives'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import vuex from '@/store'




// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

initDirectives(app)
app.use(VueFroala)
app.use(vuex)

// Mount vue app
app.mount('#app')
