import { useClipboard } from '@vueuse/core'
import type { TranslateResult } from 'vue-i18n'
import { i18n } from '../plugins/i18n'

interface ICopyToClipboardConfig {
  readonly withToast?: boolean
  readonly title?: TranslateResult
}

export const copyToClipboard = (value: string, config: ICopyToClipboardConfig = {}) => {
  const { copy } = useClipboard()
  const { withToast = true, title = i18n.t('toast.success.copied') } = config

  copy(value)

  if (withToast) {
    /* Vue.$toast({
      component: ToastificationContent,
      props: {
        title,
        icon: 'CopyIcon',
        variant: 'success',
      },
    }) */
  }
}
