import { getCurrentInstance } from 'vue'

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

  }

  return {
    confirmationModal,
  }
}
