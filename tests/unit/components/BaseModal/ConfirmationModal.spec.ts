import { describe, it } from 'vitest'
import ConfirmationModal from '../../../../src/components/BaseModal/ConfirmationModal.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { ModalSizes } from '../../../../src/@model/vuetify'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import {
  callActionShowForInternalBaseModal,
  isEqualModalDescription,
  isEqualModalTitle,
} from '../../templates/shared-tests/modal'
import { isCalledEmitEvent } from '../../templates/shared-tests/general'

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
  it('Opens modal and renders correct content', async () => {
    const wrapper = getMountConfirmationModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    isEqualModalTitle(wrapper, defaultProps.title)
    isEqualModalDescription(wrapper, defaultProps.description)
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
    isCalledEmitEvent(wrapper, 'confirmed')
  })
})
