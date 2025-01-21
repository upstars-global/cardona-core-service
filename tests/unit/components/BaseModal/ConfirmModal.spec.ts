import { describe, expect, it } from 'vitest'
import ConfirmModal from '../../../../src/components/BaseModal/ConfirmModal.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { ModalSizes } from '../../../../src/@model/vuetify'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import {
  callActionShowForInternalBaseModal,
  isEqualModalDescription,
  isEqualModalTitle,
} from '../../templates/shared-tests/modal'
import { testOn } from '../../templates/shared-tests/test-case-generator'

const getMountConfirmModal = setMountComponent(ConfirmModal)

const defaultProps = {
  id: 'test-modal',
  size: ModalSizes.Small,
  title: i18n.t('modal.addAllGames.title'),
  description: i18n.t('modal.addAllGames.description'),
}

const globalConfig = { provide: { modal: mockModal } }

describe('ConfirmModal', () => {
  it('Opens modal and renders correct content', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    isEqualModalTitle(wrapper, defaultProps.title)
    isEqualModalDescription(wrapper, defaultProps.description)
  })

  it('emits "on-click-modal-ok" on click btn add', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    await clickTrigger({ wrapper, testId: 'btn-add' })

    testOn.isCalledEmitEvent({ wrapper }, 'on-click-modal-ok')
  })

  it('emits "on-close-modal" on click btn close', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    await clickTrigger({ wrapper, testId: 'btn-cancel' })

    expect(wrapper.emitted('on-close-modal')).toBeTruthy()
  })
})
