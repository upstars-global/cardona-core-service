import { beforeAll, describe, expect, it, vi } from 'vitest'
import ConfirmModal from '../../../../src/components/BaseModal/ConfirmModal.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { ModalSizes } from '../../../../src/@model/vuetify'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { callActionShowForInternalBaseModal, isEqualModalTitle, showModal } from '../../templates/shared-tests/modal'
import {nextTick} from "vue";

const getMountConfirmModal = setMountComponent(ConfirmModal)

const defaultProps = {
  id: 'test-modal',
  size: ModalSizes.Small,
  title: i18n.t('modal.addAllGames.title'),
  description: i18n.t('modal.addAllGames.description'),
}

const globalConfig = { provide: { modal: mockModal } }

describe('ConfirmModal', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })
  it('Opens modal and renders correct content', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    isEqualModalTitle(wrapper, defaultProps.title)
    testOn.equalTextValue({ wrapper, selector: '.modal-description' }, defaultProps.description)
  })

  it('emits "on-click-modal-ok" on click btn add', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    const cancelButton = wrapper.find(getSelectorTestId('btn-add'))

    await cancelButton.trigger('click')
    expect(wrapper.emitted('on-click-modal-ok')).toBeTruthy()
  })

  it('emits "on-close-modal" on click btn close', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    const cancelButton = wrapper.find(getSelectorTestId('btn-cancel'))
    await cancelButton.trigger('click')

    expect(wrapper.emitted('on-close-modal')).toBeTruthy()
  })
})
