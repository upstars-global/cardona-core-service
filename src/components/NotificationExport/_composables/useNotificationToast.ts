import { useToast } from 'vue-toastification'
import type { TranslateResult } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import NotificationExportToast from '../Toast.vue'

export const useNotificationToast = () => {
  const { t } = useI18n()
  const toast = useToast()

  const showToast = (options: {
    downloadHandler: () => void
    entityName: TranslateResult
  }) => {
    const TIMEOUT = 5000
    toast({
      component: NotificationExportToast,
      listeners: {
        download: () => {
          options.downloadHandler()
          toast.clear()
        },
      },
      icon: false,
      props: {
        options: {
          entityName: options.entityName,
          textButton: t('action.download'),
          startMessage: t('notification.toast.startMessage'),
          endMessage: t('notification.toast.endMessage'),
        },
      },
    }, {
      timeout: TIMEOUT,
    })
  }

  return { showToast }
}
