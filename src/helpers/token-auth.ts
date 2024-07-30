import { isLoggedIn } from 'axios-jwt'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()

export const actionOnBrokenToken = () => {
  store.dispatch('authCore/clearAuth')
  router.push({ name: 'Login' })
}

export const checkIsLoggedIn = (onFail?: CallableFunction) => {
  try {
    return isLoggedIn()
  }
  catch {
    onFail && onFail()

    return true
  }
}
