import { describe, expect, it } from 'vitest'
import BaseModal from '../../../src/components/BaseModal/index.vue'
import { ModalSizes } from '../../../src/@model/vuetify'
import { mockModal } from '../mocks/modal-provide-config'
import { getSelectorTestId, setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'
import { showModal } from '../templates/shared-tests/modal'

const getMountBaseModal = setMountComponent(BaseModal)

const defaultProps = {
  id: 'test-modal',
  size: ModalSizes.Small,
  title: 'Test Modal Title',
  width: '400px',
  attach: true,
}

const slots = {
  'modal-header': '<div class="modal-header-slot">Custom Modal Header</div>',
  'default': '<div class="default-slot-content">Custom Modal Content</div>',
}

describe('BaseModal', () => {
  it('Renders BaseModal and displays modal with correct slot content after showModal is called', async () => {
    const wrapper = getMountBaseModal(defaultProps, { provide: { modal: mockModal } }, slots)

    await showModal(wrapper)

    testOn.existElement({ wrapper, selector: '.modal-header-slot' })
    testOn.existElement({ wrapper, selector: '.default-slot-content' })
  })

  it('Call event hide on click button close modal', async () => {
    const wrapper = getMountBaseModal(defaultProps, { provide: { modal: mockModal } }, slots)

    await showModal(wrapper)

    await wrapper.find(getSelectorTestId('btn-close')).trigger('click')
    testOn.isCalledEmitEventHide({ wrapper })
  })

  it('Exist content by props', async () => {
    const wrapper = getMountBaseModal(defaultProps, { provide: { modal: mockModal } })

    await showModal(wrapper)

    testOn.equalTextValue({ wrapper, testId: 'modal-title' }, defaultProps.title)
    expect(wrapper.find('.v-overlay__content').element.style.width).toBe(defaultProps.width)
  })
})
