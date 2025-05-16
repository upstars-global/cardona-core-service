import { useToast } from 'vue-toastification'
import ToastificationContent from '../components/templates/toast/ToastificationContent.vue'
import { IconsList } from '../@model/enums/icons'
import { i18n } from '@/plugins/i18n'

type ToastOptions = Record<string | 'defaultCode' | 'defaultDescription', string | undefined>

const defaultOptions: ToastOptions = {
  defaultText: '',
  defaultCode: 'default',
  defaultDescription: '',
}

export default function useToastService() {
  const toast = useToast()

  const toastSuccess = (code: string, options: ToastOptions = defaultOptions) => {
    const { defaultText = '', defaultCode = 'default', defaultDescription = undefined } = options

    const message = i18n.te(`toast.success.${code}`)
      ? `toast.success.${code}`
      : `toast.success.${defaultCode}`

    const text = defaultDescription || (i18n.te(`toast.success.${code}-text`)
      ? i18n.t(`toast.success.${code}-text`)
      : undefined)

    toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: IconsList.CheckCircleIcon,
        variant: 'success',
        text,
      },
    })
  }

  function safeTe(key: string): boolean {
    const translated = i18n.t(key, {}, { default: '' })

    return translated !== '' && translated !== key
  }

  const toastError = (code: string, options: ToastOptions = defaultOptions) => {
    const fullKey = `toast.error.${code}`
    const fallbackKey = `toast.error.${options?.defaultCode}`

    const message = safeTe(fullKey)
      ? i18n.t(fullKey, options)
      : options?.defaultText || i18n.t(fallbackKey, options)

    toast({
      component: ToastificationContent,
      props: {
        title: message,
        icon: IconsList.AlertTriangleIcon,
        variant: 'error',
      },
    })
  }

  const toastErrorMessageString = (message: string) => {
    const strToRemove = 'Invalid response. '
    const newMessage = message.replace(strToRemove, '')

    toast({
      component: ToastificationContent,
      props: {
        title: newMessage,
        icon: IconsList.AlertTriangleIcon,
        variant: 'error',
      },
    })
  }

  return {
    toastSuccess,
    toastError,
    toastErrorMessageString,
  }
}
