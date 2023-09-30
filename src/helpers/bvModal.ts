import { getCurrentInstance } from 'vue'
import i18n from '../plugins/i18n'

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
    return proxy.$bvModal.msgBoxConfirm(i18n.global.t(`modal.${localeKey}.description`), {
      title: i18n.global.t(`modal.${localeKey}.title`),
      size: 'sm',
      okVariant: okVariants[type],
      okTitle: i18n.global.t(okTitles[type]),
      cancelVariant: 'outline-secondary',
      cancelTitle: i18n.global.t('action.cancel'),
      hideHeaderClose: false,
      centered: true,
    })
  }

  return {
    confirmationModal,
  }
}
