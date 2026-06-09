import type { TranslateResult } from 'vue-i18n'

export interface ModalActionsFromSlot {
  show: Function
  hide: Function
}

export interface BaseModalDefaultPropsOfSlot {
  action: ModalActionsFromSlot
  payload?: unknown
}

export interface ConfirmModalPropsOfSlotDefault {
  action: ModalActionsFromSlot
  payload: {
    title: TranslateResult
    description: TranslateResult
    btnConfirmText: TranslateResult
  }
}
