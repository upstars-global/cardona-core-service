import type { App } from 'vue'
import Toast from 'vue-toastification'

// Import the CSS or use your own!
import '../assets/styles/components/toastification.scss'

const options = {
  hideProgressBar: true,
  closeOnClick: false,
  closeButton: false,
  icon: false,
  timeout: 3000,
  transition: 'Vue-Toastification__fade',
}

export default function (app: App) {
  app.use(Toast, options)
}
