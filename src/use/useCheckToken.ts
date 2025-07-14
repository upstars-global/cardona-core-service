import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { TOKEN_INVALID } from 'cardona-core-service/src/utils/constants'
import useToastService from 'cardona-core-service/src/helpers/toasts'
import { useUserStore } from '../stores/user'

const { toastError } = useToastService()

export function useCheckToken() {
  const store = useStore()
  const router = useRouter()

  const getActualTokenKey = () => Object.keys(localStorage).find(key => key.includes('auth-tokens-'))

  const actionOnBrokenToken = async (withToast = false) => {
    withToast && toastError(TOKEN_INVALID)
    await store.dispatch('authCore/clearAuth')
    await router.push('/login')
  }

  const isValidLocalStorageValue = async (): Promise<boolean> => {
    try {
      JSON.parse(localStorage.getItem(getActualTokenKey())).accessToken

      return true
    }
    catch {
      await actionOnBrokenToken(true)

      return false
    }
  }

  const checkOnActualToken = async () => {
    const userStore = useUserStore()

    try {
      await store.dispatch('fetchCurrentUser')
      await userStore.fetchCurrentUser()
    }
    catch {
      await actionOnBrokenToken()
    }
  }

  window.addEventListener('storage', async () => {
    const isValid = await isValidLocalStorageValue()
    if (isValid)
      await checkOnActualToken()
  })
}
