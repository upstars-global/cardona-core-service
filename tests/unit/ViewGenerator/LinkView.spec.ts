import { beforeEach, describe, expect, it, vi } from 'vitest'
import LinkView from '../../../src/components/templates/ViewGenerator/_components/LinkView.vue'
import { getWrapperElement, setMountComponent } from '../utils'
import type { Nullable } from '../../../src/@model/index'

const mockModal = {
  showModal: vi.fn(),
  hideModal: vi.fn(),
  registerModal: vi.fn(),
  unregisterModal: vi.fn(),
  modals: {},
}

const getMountLinkView = setMountComponent(LinkView)

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
  const pElement = getWrapperElement({ wrapper, testId: 'title' })

  expect(pElement.exists()).toBe(true)
  await pElement.trigger('click')
}

const createWrapper = (
  abilityCanReturnValue: boolean,
  mockItem: {
    value: { title: string; modalId: string; route: Nullable<unknown> }
    permission: Nullable<string>
  }) => {
  mockAbilityCan.mockReturnValue(abilityCanReturnValue)

  return getMountLinkView({ item: mockItem }, {
    provide: {
      modal: mockModal,
    },
    stubs: {
      RouterLink: true,
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

  it('Does not call showModal when canUpdate is false', async () => {
    const wrapper = createWrapper(false, mockItem)

    await findAndTriggerClick(wrapper)
    expect(mockModal.showModal).not.toHaveBeenCalled()
  })

  it('Calls showModal when item is clicked and canUpdate is true', async () => {
    const wrapper = createWrapper(true, mockItem)

    await findAndTriggerClick(wrapper)
    expect(mockModal.showModal).toHaveBeenCalledWith('test-modal')
  })
})
