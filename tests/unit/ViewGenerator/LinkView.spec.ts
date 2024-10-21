import { beforeEach, describe, it, vi } from 'vitest'
import type { BaseWrapper } from '@vue/test-utils'
import LinkView from '../../../src/components/templates/ViewGenerator/_components/LinkView.vue'
import { getWrapperElement, setMountComponent } from '../utils'
import type { Nullable } from '../../../src/@model/index'
import { testOn } from '../templates/shared-tests/test-case-generator'
import {mockModal} from "../mocks/modal-provide-config";

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

const findAndTriggerClick = async (wrapperParent: BaseWrapper<Node>) => {
  const wrapper = getWrapperElement({ wrapper: wrapperParent, testId: 'title' })

  testOn.existElement({ wrapper })
  await wrapper.trigger('click')
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

const wrapperModal = mockModal.showModal
const argumentOnShowModal = 'test-modal'

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
    testOn.checkNotExistCalledMethod({ wrapper: wrapperModal })
  })

  it('Calls showModal when item is clicked and canUpdate is true', async () => {
    const wrapper = createWrapper(true, mockItem)

    await findAndTriggerClick(wrapper)
    testOn.checkExistCalledMethodWithArguments({ wrapper: wrapperModal }, argumentOnShowModal)
  })
})
