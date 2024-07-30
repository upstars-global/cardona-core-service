import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useStorage } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

export function useCheckToken() {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()

  const isLoginPage = computed(() => route.name === 'Login')

  const tokenKey = ref<string>('')
  const getActualTokenKey = () => Object.keys(localStorage).find(key => key.includes('auth-tokens-'))
  const tokenState = ref<Record<string, unknown> | null>(null)

  const actionOnBrokenToken = () => {
    store.dispatch('authCore/clearAuth')
    router.push({ name: 'Login' })
  }

  const checkOnActualToken = async () => {
    try {
      await store.dispatch('fetchCurrentUser')
    }
    catch (e) {
      await actionOnBrokenToken()
    }
  }

  watch(() => tokenState.value, async () => {
    if (isLoginPage.value)
      return

    await checkOnActualToken()
  }, { deep: true })

  const initCheckToken = () => {
    tokenKey.value = getActualTokenKey()

    try {
      tokenState.value = useStorage(tokenKey.value, JSON.parse(localStorage[tokenKey.value]))
    }
    catch (e) {
      actionOnBrokenToken()
    }
  }

  return {
    initCheckToken,
  }
}
