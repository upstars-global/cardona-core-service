import { useRouter } from 'vue-router'
import { TOKEN_INVALID } from '../utils/constants'
import useToastService from '../helpers/toasts'
import { useAuthCoreStore } from '../stores/authCore'
import { useUserStore } from '../stores/user'

const { toastError } = useToastService()

export function useCheckToken() {
  const router = useRouter()
  const authCoreStore = useAuthCoreStore()

  const getActualTokenKey = () => Object.keys(localStorage).find(key => key.includes('auth-tokens-'))

  const actionOnBrokenToken = async (withToast = false) => {
    withToast && toastError(TOKEN_INVALID)
    authCoreStore.clearAuth()
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
    try {
      await useUserStore().fetchCurrentUser()
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
