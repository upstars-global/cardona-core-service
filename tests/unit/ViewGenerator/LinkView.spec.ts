import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LinkView from '../../../src/components/templates/ViewGenerator/_components/LinkView.vue'

const mockModal = {
  showModal: vi.fn(),
  hideModal: vi.fn(),
  registerModal: vi.fn(),
  unregisterModal: vi.fn(),
  modals: {},
}

const mockAbilityCan = vi.fn()

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => ({
      getters: {
        abilityCan: mockAbilityCan,
      },
    }),
  }
})

const findAndTriggerClick = async wrapper => {
  const pElement = wrapper.find('[data-test-id="text"]')

  expect(pElement.exists()).toBe(true)
  await pElement.trigger('click')
}

const createWrapper = (abilityCanReturnValue, mockItem) => {
  mockAbilityCan.mockReturnValue(abilityCanReturnValue)

  return mount(LinkView, {
    props: {
      item: mockItem,
    },
    global: {
      provide: {
        modal: mockModal,
      },
      stubs: {
        RouterLink: true,
      },
    },
  })
}

describe('LinkView.vue', () => {
  const mockItem = {
    value: { title: 'Test Title', modalId: 'test-modal', route: null },
    permission: 'test-permission',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not call showModal when canUpdate is false', async () => {
    const wrapper = createWrapper(false, mockItem)

    await findAndTriggerClick(wrapper)
    expect(mockModal.showModal).not.toHaveBeenCalled()
  })

  it('calls showModal when item is clicked and canUpdate is true', async () => {
    const wrapper = createWrapper(true, mockItem)

    await findAndTriggerClick(wrapper)
    expect(mockModal.showModal).toHaveBeenCalledWith('test-modal')
  })
})
