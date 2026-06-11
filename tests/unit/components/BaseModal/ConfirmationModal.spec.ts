import { describe, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import ConfirmationModal from '../../../../src/components/BaseModal/ConfirmationModal.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import {
  callActionShowForInternalBaseModal,
  isEqualModalDescription,
  isEqualModalTitle,
} from '../../templates/shared-tests/modal'
import * as loaderStoreModule from '../../../../src/stores/loader'

const getMountConfirmationModal = setMountComponent(ConfirmationModal)

const defaultProps = {
  modalId: 'test-modal',
  title: i18n.t('modal.addAllGames.title'),
  description: i18n.t('modal.addAllGames.description'),
  actionBtnText: i18n.t('action.send'),
}

const globalConfig = { provide: { modal: mockModal } }
const testIdConfirmBtn = 'btn-accept'
const btnDisabledClass = 'v-btn--disabled'

describe('ConfirmationModal', () => {
  it('Opens modal and renders correct content', async () => {
    const wrapper = getMountConfirmationModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    isEqualModalTitle(wrapper, defaultProps.title)
    isEqualModalDescription(wrapper, defaultProps.description)
    testOn.equalTextValue({ wrapper, testId: testIdConfirmBtn }, defaultProps.confirmBtnText)
    testOn.notExistClasses({ wrapper, testId: testIdConfirmBtn }, btnDisabledClass)
  })

  it('Loading state button', async () => {
    setActivePinia(createPinia())

    const loaderStoreSpy = vi.spyOn(loaderStoreModule, 'useLoaderStore').mockReturnValue({
      isLoadingEndpoint: () => true,
    })

    const wrapper = getMountConfirmationModal({ ...defaultProps, loadingUrls: '/api/test' }, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    testOn.existClass({ wrapper, testId: testIdConfirmBtn }, btnDisabledClass)

    loaderStoreSpy.mockRestore()
  })

  it('Valid actions on button clicks', async () => {
    const wrapper = getMountConfirmationModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    await clickTrigger({ wrapper, testId: testIdConfirmBtn })
    testOn.isCalledEmitEvent({ wrapper }, 'confirmed')
  })
})
