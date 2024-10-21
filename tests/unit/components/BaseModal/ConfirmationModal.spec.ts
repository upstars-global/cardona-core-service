import { beforeAll, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import ConfirmationModal from '../../../../src/components/BaseModal/ConfirmationModal.vue'
import { callActionShowForInternalBaseModal, getWrapperElement, setMountComponent } from '../../utils'
import { ModalSizes } from '../../../../src/@model/vuetify'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { testOn } from '../../templates/shared-tests/test-case-generator'

const getMountConfirmationModal = setMountComponent(ConfirmationModal)

const defaultProps = {
  id: 'test-modal',
  size: ModalSizes.Small,
  title: i18n.t('modal.addAllGames.title'),
  description: i18n.t('modal.addAllGames.description'),
  actionBtnText: i18n.t('action.send'),
  isLoading: false,
}

const testIdConfirmBtn = 'btn-confirm'
const btnLoadingClass = 'v-btn--loading'

describe('ConfirmationModal', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })
  it('Opens modal and renders correct content', async () => {
    const wrapper = getMountConfirmationModal(defaultProps, { provide: { modal: mockModal } })

    await callActionShowForInternalBaseModal(wrapper)

    testOn.equalTextValue({ wrapper, selector: '.modal-title' }, defaultProps.title)
    testOn.equalTextValue({ wrapper, selector: '.modal-description' }, defaultProps.description)
    testOn.equalTextValue({ wrapper, testId: testIdConfirmBtn }, defaultProps.actionBtnText)
    testOn.notExistClasses({ wrapper, testId: testIdConfirmBtn }, btnLoadingClass)
  })

  it('Loading state button', async () => {
    const wrapper = getMountConfirmationModal({ ...defaultProps, isLoading: true }, { provide: { modal: mockModal } })

    await callActionShowForInternalBaseModal(wrapper)

    testOn.existClass({ wrapper, testId: testIdConfirmBtn }, btnLoadingClass)
  })

  it('Valid actions on button clicks', async () => {
    const wrapper = getMountConfirmationModal({ ...defaultProps, isLoading: true }, { provide: { modal: mockModal } })

    await callActionShowForInternalBaseModal(wrapper)

    const btnConfirm = getWrapperElement({ wrapper, testId: testIdConfirmBtn }) as VueWrapper

    await btnConfirm.trigger('click')
    expect(wrapper.emitted('confirmed')).toBeTruthy()
  })
})
