import { getCurrentInstance } from 'vue'
import { t } from '../plugins/i18n'

export const useBvModal = () => {
  const vm = getCurrentInstance()!.proxy

  return {} // TODO vm.$bvModal
}

export enum ConfirmModal {
  Add = 'Add',
  Delete = 'Delete',
}
enum okVariants {
  Add = 'success',
  Delete = 'danger',
}
enum okTitles {
  Add = 'action.add',
  Delete = 'action.remove',
}

export const useModal = () => {
  const { proxy } = getCurrentInstance() as any

  // Confirmation modal
  const confirmationModal = (localeKey = 'default', type: string = ConfirmModal.Delete) => {
    return proxy.$bvModal.msgBoxConfirm(t(`modal.${localeKey}.description`), {
      title: t(`modal.${localeKey}.title`),
      size: 'sm',
      okVariant: okVariants[type],
      okTitle: t(okTitles[type]),
      cancelVariant: 'outline-secondary',
      cancelTitle: t('action.cancel'),
      hideHeaderClose: false,
      centered: true,
    })
  }

  return {
    confirmationModal,
  }
}
