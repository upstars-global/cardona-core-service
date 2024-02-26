import Vue from 'vue'
import ToastificationContent from '../@core/components/toastification/ToastificationContent.vue'
import i18n from '../libs/i18n'
import { IconsList } from '../@model/enums/icons'

type ToastOptions = Record<string | 'defaultCode' | 'defaultDescription', string | undefined>

const defaultOptions: ToastOptions = {
  defaultText: '',
  defaultCode: 'default',
  defaultDescription: undefined,
}

export default function useToastService() {
  const toastSuccess = (code: string, options: ToastOptions = defaultOptions) => {
    const { defaultText = '', defaultCode = 'default', defaultDescription = undefined } = options

    const message = i18n.te(`toast.success.${code}`)
      ? `toast.success.${code}`
      : `toast.success.${defaultCode}`

    const text = defaultDescription
      ? defaultDescription
      : i18n.te(`toast.success.${code}-text`)
      ? i18n.t(`toast.success.${code}-text`)
      : undefined

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: IconsList.CheckCircleIcon,
        variant: 'success',
        text,
      },
    })
  }

  const toastError = (code, options: ToastOptions = defaultOptions) => {
    const message = i18n.te(`toast.error.${code}`)
      ? `toast.error.${code}`
      : options?.defaultText
      ? options.defaultText
      : `toast.error.${options.defaultCode}`

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: IconsList.AlertTriangleIcon,
        variant: 'danger',
      },
    })
  }

  const toastErrorMessageString = (message: string) => {
    const strToRemove = 'Invalid response. '
    const newMessage = message.replace(strToRemove, '')

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: newMessage,
        icon: IconsList.AlertTriangleIcon,
        variant: 'danger',
      },
    })
  }

  return {
    toastSuccess,
    toastError,
    toastErrorMessageString,
  }
}
