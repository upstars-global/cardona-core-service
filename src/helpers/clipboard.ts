import Vue from 'vue'
import { useClipboard } from '@vueuse/core'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import i18n from '@/libs/i18n'

interface ICopyToClipboardConfig {
  readonly withToast?: boolean
  readonly title?: string
}

export const copyToClipboard = (value: string, config: ICopyToClipboardConfig = {}) => {
  const { copy } = useClipboard()
  const { withToast = true, title = i18n.t('toast.success.IDcopied') } = config

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
