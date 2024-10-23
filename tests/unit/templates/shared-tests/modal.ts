import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { testOn } from './test-case-generator'

export const showModal = async (wrapperModal: VueWrapper) => {
  await wrapperModal.vm.show()
  await nextTick()
}

export const callActionShowForInternalBaseModal = async (wrapper: VueWrapper) => {
  const baseModalWrapper = wrapper.findComponent({ name: 'BaseModal' })

  await showModal(baseModalWrapper)
}

export const isEqualModalTitle = (wrapper: VueWrapper, value: string) => {
  testOn.equalTextValue({ wrapper, testId: 'modal-title' }, value)
}

export const isEqualModalDescription = (wrapper: VueWrapper, value: string) => {
  testOn.equalTextValue({ wrapper, testId: 'modal-description' }, value)
}
