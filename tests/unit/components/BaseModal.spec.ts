import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseModal from '../../../src/components/BaseModal/index.vue'
import { ModalSizes } from '../../../src/@model/vuetify'
import { mockModal } from '../mocks/modal-provide-config'
import { getSelectorTestId, setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'

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
    const wrapper = mount(BaseModal, {
      props: defaultProps,
      global: {
        provide: {
          modal: mockModal,
        },
      },
      slots,
      attachTo: document.body,
    })

    await wrapper.vm.show()
    await nextTick()

    testOn.existElement({ wrapper, selector: '.modal-header-slot' })
    testOn.existElement({ wrapper, selector: '.default-slot-content' })
  })

  it('Call event hide on click button close modal', async () => {
    const wrapper = mount(BaseModal, {
      props: defaultProps,
      global: {
        provide: {
          modal: mockModal,
        },
      },
      slots,
      attachTo: document.body,
    })

    await wrapper.vm.show()
    await nextTick()

    await wrapper.find(getSelectorTestId('btn-close')).trigger('click')
    expect(wrapper.emitted('hide')).toBeTruthy()
  })

  it('Exist content by props', async () => {
    const wrapper = mount(BaseModal, {
      props: defaultProps,
      global: {
        provide: {
          modal: mockModal,
        },
      },
      attachTo: document.body,
    })

    await wrapper.vm.show()
    await nextTick()
    expect(wrapper.find('.modal-title').text()).toBe(defaultProps.title)
    expect(wrapper.find('.v-overlay__content').element.style.width).toBe(defaultProps.width)
  })
})
