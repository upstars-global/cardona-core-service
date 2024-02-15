import { useClipboard } from '@vueuse/core'
import type { TranslateResult } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { i18n } from '../plugins/i18n'
import ToastificationContent from '@/components/templates/toast/ToastificationContent.vue'
import { IconsList } from '@/@model/enums/icons'

interface ICopyToClipboardConfig {
  readonly withToast?: boolean
  readonly title?: TranslateResult
}

export const copyToClipboard = (value: string, config: ICopyToClipboardConfig = {}) => {
  const { copy } = useClipboard()
  const { withToast = true, title = i18n.t('toast.success.copied') } = config

  copy(value)

  if (withToast) {
    const toast = useToast()

    toast({
      component: ToastificationContent,
      props: {
        title,
        variant: 'success',
        icon: IconsList.CopyIcon,
      },
    })
  }
}
