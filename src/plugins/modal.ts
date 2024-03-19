import type { App, InjectionKey } from 'vue'

interface IModalInstance {
  show: (payload: Record<string, unknown>) => void
  hide: () => void
}

export interface IModalPlugin {
  modals: Record<string, IModalInstance>
  showModal: (modalKey: string) => void
  hideModal: (modalKey: string) => void
  registerModal: (modalKey: string, modalInstance: IModalInstance) => void
  unregisterModal: (modalKey: string) => void
}

export const modalPluginKey: InjectionKey<IModalPlugin> = 'modal'
export default function (app: App) {
  const modal = (app: App) => {
    const modals: Record<string, IModalInstance> = {}

    const showModal = (modalKey: string, payload: Record<string, unknown>) => {
      if (modals[modalKey])
        modals[modalKey].show(payload)
    }

    const hideModal = (modalKey: string) => {
      if (modals[modalKey])
        modals[modalKey].hide()
    }

    const registerModal = (modalKey: string, modalInstance: IModalInstance) => {
      modals[modalKey] = modalInstance
    }

    const unregisterModal = (modalKey: string) => {
      if (modals[modalKey])
        delete modals[modalKey]
    }

    app.config.globalProperties.$modal = {
      showModal,
      hideModal,
      registerModal,
      unregisterModal,
    }

    app.provide(modalPluginKey, {
      modals,
      showModal,
      hideModal,
      registerModal,
      unregisterModal,
    })
  }

  app.use(modal)
}
