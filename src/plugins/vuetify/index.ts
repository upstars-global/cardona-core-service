import { createVuetify } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import defaults from './defaults'
import { icons } from './icons'
import theme from './theme'

// Styles
import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default createVuetify({
  aliases: {
    IconBtn: VBtn,
  },
  defaults,
  icons,
  theme,
  components: {
    VSkeletonLoader,
  },
})
