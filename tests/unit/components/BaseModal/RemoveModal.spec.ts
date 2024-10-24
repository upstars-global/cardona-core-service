import { beforeAll, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import RemoveModal from '../../../../src/components/BaseModal/RemoveModal.vue'
import {clickTrigger, getSelectorTestId, getWrapperElement, setMountComponent, setValue} from '../../utils'
import { ModalSizes } from '../../../../src/@model/vuetify'
import { i18n } from '../../../../src/plugins/i18n'
import { mockModal } from '../../mocks/modal-provide-config'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import {
  callActionShowForInternalBaseModal,
  isEqualModalDescription,
  isEqualModalTitle
} from '../../templates/shared-tests/modal'
import { testOnValidPlaceholder } from '../../templates/shared-tests/text-input-fields'

const getMountConfirmModal = setMountComponent(RemoveModal)

const defaultProps = {
  removeModalId: 'test-modal',
  size: ModalSizes.Small,
  title: i18n.t('modal.addAllGames.title'),
  description: i18n.t('modal.addAllGames.description'),
}

const globalConfig = { provide: { modal: mockModal } }

describe('ConfirmationModal', () => {
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
    isEqualModalDescription(wrapper, defaultProps.description)
  })

  it('Emits "on-click-modal-ok" on click btn add', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    const cancelButton = wrapper.find(getSelectorTestId('btn-remove'))

    await cancelButton.trigger('click')
    expect(wrapper.emitted('on-click-modal-ok')).toBeTruthy()
  })

  it('Emits "on-close-modal" on click btn close', async () => {
    const wrapper = getMountConfirmModal(defaultProps, globalConfig)

    await callActionShowForInternalBaseModal(wrapper)

    const cancelButton = wrapper.find(getSelectorTestId('btn-cancel'))
    await cancelButton.trigger('click')

    expect(wrapper.emitted('on-close-modal')).toBeTruthy()
  })

  it('Script on set comment and click button remove', async () => {
    const props = {
      ...defaultProps,
      withRemoveComment: true,
    }

    const textInputValue = 'Some test text'

    const wrapper = getMountConfirmModal(
      props,
      globalConfig,
    )

    await callActionShowForInternalBaseModal(wrapper)

    const commentTextarea = getWrapperElement({ wrapper, selector: 'textarea' }) as VueWrapper

    await setValue(commentTextarea, textInputValue)

    testOn.existElement({ wrapper: commentTextarea })
    testOnValidPlaceholder(commentTextarea, i18n.t('common.comment'))

    testOn.inputAttributeValueToBe({ wrapper: commentTextarea }, textInputValue)

    await clickTrigger({ wrapper, testId: 'btn-remove' })

    const emitted = wrapper.emitted('on-click-modal-ok')

    expect(emitted).toBeTruthy()

    const emittedPayload = emitted?.[0]?.[0]

    expect(emittedPayload.commentToRemove).toBe(textInputValue)
  })
})
