import { beforeAll, describe, expect, it } from 'vitest'
import ConfirmationModal from '../../../../src/components/BaseModal/ConfirmationModal.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { ModalSizes } from '../../../../src/@model/vuetify'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { callActionShowForInternalBaseModal, isEqualModalTitle } from '../../templates/shared-tests/modal'

const getMountConfirmationModal = setMountComponent(ConfirmationModal)

const defaultProps = {
  id: 'test-modal',
  size: ModalSizes.Small,
  title: i18n.t('modal.addAllGames.title'),
  description: i18n.t('modal.addAllGames.description'),
  actionBtnText: i18n.t('action.send'),
  isLoading: false,
}

const globalConfig = { provide: { modal: mockModal } }
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
    const wrapper = getMountConfirmationModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    isEqualModalTitle(wrapper, defaultProps.title)
    testOn.equalTextValue({ wrapper, selector: '.modal-description' }, defaultProps.description)
    testOn.equalTextValue({ wrapper, testId: testIdConfirmBtn }, defaultProps.actionBtnText)
    testOn.notExistClasses({ wrapper, testId: testIdConfirmBtn }, btnLoadingClass)
  })

  it('Loading state button', async () => {
    const wrapper = getMountConfirmationModal({ ...defaultProps, isLoading: true }, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    testOn.existClass({ wrapper, testId: testIdConfirmBtn }, btnLoadingClass)
  })

  it('Valid actions on button clicks', async () => {
    const wrapper = getMountConfirmationModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    await clickTrigger({ wrapper, testId: testIdConfirmBtn })
    expect(wrapper.emitted('confirmed')).toBeTruthy()
  })
})
