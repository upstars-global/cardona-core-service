import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useStorage } from '@vueuse/core'
import useToastService from '../helpers/toasts'

export function useCheckToken() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const isLoginPage = computed(() => route.name === 'Login')

  const tokenKey = ref<Ref<Record<string, unknown> | null>>(null)
  const getActualTokenKey = () => Object.keys(localStorage).find(key => key.includes('auth-tokens-'))
  const tokenState = ref(null)
  const { toastError } = useToastService()

  watch(() => tokenState.value, async () => {
    if (isLoginPage.value)
      return
    try {
      JSON.parse(localStorage[tokenKey.value])
    }
    catch (e) {
      toastError('TOKEN_INVALID')
      await store.dispatch('authCore/clearAuth')
      await router.push({ name: 'Login' })
    }
  }, { deep: true })

  const initCheckToken = () => {
    const tokenKey = getActualTokenKey()

    tokenState.value = useStorage(tokenKey, JSON.parse(localStorage[tokenKey]))
  }

  return {
    initCheckToken,
  }
}
