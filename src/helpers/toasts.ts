import Vue from 'vue'
import ToastificationContent from '../@core/components/toastification/ToastificationContent.vue'
import i18n from '../libs/i18n'

type ToastOptions = Record<string | 'defaultCode', string>

const defaultOptions: ToastOptions = {
  defaultCode: 'default',
}

export default function useToastService() {
  const toastSuccess = (code: string, options: ToastOptions = defaultOptions) => {
    const message = i18n.te(`toast.success.${code}`)
      ? `toast.success.${code}`
      : `toast.success.${options.defaultCode}`

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: 'CheckCircleIcon',
        variant: 'success',
      },
    })
  }

  const toastError = (code, options: ToastOptions = defaultOptions) => {
    const message = i18n.te(`toast.error.${code}`)
      ? `toast.error.${code}`
      : `toast.error.${options.defaultCode}`

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: 'AlertTriangleIcon',
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
        icon: 'AlertTriangleIcon',
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
