import Vue from 'vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import i18n from '@/libs/i18n'

export default function useToastService() {
  const toastSuccess = (code: string, options?: object) => {
    const message = i18n.te(`toast.success.${code}`)
      ? `toast.success.${code}`
      : 'toast.success.default'

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: 'CheckCircleIcon',
        variant: 'success',
      },
    })
  }

  const toastError = (code, options?: object) => {
    const message = i18n.te(`toast.error.${code}`) ? `toast.error.${code}` : 'toast.error.default'

    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: i18n.t(message, options),
        icon: 'AlertTriangleIcon',
        variant: 'danger',
      },
    })
  }

  const toastErrorMessageString = (message: string, options?: object) => {
    Vue.$toast({
      component: ToastificationContent,
      props: {
        title: message,
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
