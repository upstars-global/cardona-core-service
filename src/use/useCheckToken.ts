import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useStorage } from '@vueuse/core'

export function useCheckToken() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const isLoginPage = computed(() => route.name === 'Login')

  const tokenKey = ref<string>('')
  const getActualTokenKey = () => Object.keys(localStorage).find(key => key.includes('auth-tokens-'))
  const tokenState = ref<Record<string, unknown> | null>(null)

  const checkOnActualToken = async () => {
    try {
      await store.dispatch('fetchCurrentUser')
    }
    catch (e) {
      await store.dispatch('authCore/clearAuth')
      await router.push({ name: 'Login' })
    }
  }

  watch(() => tokenState.value, async () => {
    if (isLoginPage.value)
      return

    await checkOnActualToken()
  }, { deep: true })

  const initCheckToken = () => {
    tokenKey.value = getActualTokenKey()

    tokenState.value = useStorage(tokenKey.value, JSON.parse(localStorage[tokenKey.value]))
  }

  return {
    initCheckToken,
  }
}
