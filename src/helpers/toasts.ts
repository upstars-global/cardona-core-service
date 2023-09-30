type ToastOptions = Record<string | 'defaultCode', string>

const defaultOptions: ToastOptions = {
  defaultText: '',
  defaultCode: 'default',
}

export default function useToastService() {
  const toastSuccess = (code: string, options: ToastOptions = defaultOptions) => {
    /* const message = i18n.te(`toast.success.${code}`)
      ? `toast.success.${code}`
      : `toast.success.${options.defaultCode}` */

    /* Vue.$toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: IconsList.CheckCircleIcon,
        variant: 'success',
      },
    }) */
  }

  const toastError = (code, options: ToastOptions = defaultOptions) => {
    /* const message = i18n.te(`toast.error.${code}`)
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
    }) */
  }

  const toastErrorMessageString = (message: string) => {
    /* const strToRemove = 'Invalid response. '
    const newMessage = message.replace(strToRemove, '')

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: newMessage,
        icon: IconsList.AlertTriangleIcon,
        variant: 'danger',
      },
    }) */
  }

  return {
    toastSuccess,
    toastError,
    toastErrorMessageString,
  }
}
