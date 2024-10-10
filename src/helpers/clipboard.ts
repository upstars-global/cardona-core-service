import { useClipboard } from '@vueuse/core'
import type { TranslateResult } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { i18n } from '../plugins/i18n'
import { IconsList } from '../@model/enums/icons'
import ToastificationContent from '../components/templates/toast/ToastificationContent.vue'

interface ICopyToClipboardConfig {
  readonly withToast?: boolean
  readonly title?: TranslateResult
  readonly icon?: IconsList
}

export const copyToClipboard = (value: string, config: ICopyToClipboardConfig = {}) => {
  const { copy } = useClipboard()
  const { withToast = true, title = i18n.t('toast.success.copied'), icon = IconsList.CopyIcon } = config

  copy(value)

  if (withToast) {
    const toast = useToast()

    toast({
      component: ToastificationContent,
      props: {
        title,
        variant: 'success',
        icon,
      },
    })
  }
}
