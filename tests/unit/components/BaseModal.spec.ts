import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import BaseModal from '../../../src/components/BaseModal/index.vue'
import { ModalSizes } from '../../../src/@model/vuetify'
import { mockModal } from '../mocks/modal-provide-config'
import { setMountComponent } from '../utils'

export default defineComponent({
  components: { BaseModal },
})

const wrapperFactory = (props = {}) => {
  return mount(BaseModal, {
    props: {
      id: 'test-modal',
      title: 'Test Modal',
      ...props,
    },
    global: {
      provide: {
        modal: mockModal, // Мокаем modal инъекцию
      },
    },
  })
}

const getMountBaseModal = setMountComponent(BaseModal)

const defaultProps = {
  id: 'test-modal',
  size: ModalSizes.Small,
  title: 'Test Modal Title',
  width: '400px',
}

describe('BaseModal', () => {
  it('renders BaseModal and displays modal with correct slot content after showModal is called', async () => {
    // const teleportTarget = document.createElement('div')
    // teleportTarget.setAttribute('id', 'teleport-target')
    // document.body.appendChild(teleportTarget)

    const wrapper = mount(BaseModal, {
      props: {
        id: 'test-modal',
        title: 'Test Modal Title',
        size: ModalSizes.Small,
        width: '400px',
      },
      global: {
        provide: {
          modal: mockModal,
        },
      },
      slots: {
        'modal-header': '<div class="modal-header-slot">Custom Modal Header</div>',
        'default': '<div class="default-slot-content">Custom Modal Content</div>',
      },
      attachTo: document.body,
    })

    await wrapper.vm.show()
    await nextTick()
    await nextTick()

    const dialog = document.querySelector('.v-dialog')

    // console.log(dialog.querySelector('.modal-header-slot').outerHTML.includes('<div class="modal-header-slot">Custom Modal Header</div>'))
  })
})
