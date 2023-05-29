import Vue from 'vue'
import { useClipboard } from '@vueuse/core'
import ToastificationContent from '../@core/components/toastification/ToastificationContent.vue'
import i18n from '../libs/i18n'
import { TranslateResult } from 'vue-i18n'

interface ICopyToClipboardConfig {
  readonly withToast?: boolean
  readonly title?: TranslateResult
}

export const copyToClipboard = (value: string, config: ICopyToClipboardConfig = {}) => {
  const { copy } = useClipboard()
  const { withToast = true, title = i18n.t('toast.success.copied') } = config

  copy(value)

  if (withToast) {
    Vue.$toast({
      component: ToastificationContent,
      props: {
        title,
        icon: 'CopyIcon',
        variant: 'success',
      },
    })
  }
}
