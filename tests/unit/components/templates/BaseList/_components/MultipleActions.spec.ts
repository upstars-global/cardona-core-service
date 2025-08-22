import { beforeEach, describe, expect, it, vi } from 'vitest'
import MultipleActions from '../../../../../../src/components/templates/BaseList/_components/MultipleActions.vue'
import { clickTrigger, getWrapperElement, setMountComponent } from '../../../../utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import { i18n } from '../../../../../../src/plugins/i18n'
import { VColors, VSizes, VVariants } from '../../../../../../src/@model/vuetify'
import { mockModal } from '../../../../mocks/modal-provide-config'
import { ModalsId } from '../../../../../../src/@model/modalsId'
import { MultipleActions as MultipleActionsEnum } from '../../../../../../src/@model/enums/multipleActions'

const getMountMultipleActions = setMountComponent(MultipleActions)

const defaultProps = {
  numberSelectedItems: 0,
  canRemove: false,
}

let props

const getTestIdButtons = (canRemove: boolean) => ['activate', 'deactivate', canRemove && 'remove'].filter(Boolean)

const global = {
  provide: { modal: mockModal },
}

beforeEach(() => {
  props = defaultProps
})

describe('MultipleActions.vue', () => {
  it('Renders correctly base elements', () => {
    const wrapper = getMountMultipleActions(props, global)

    const testIdButtons = getTestIdButtons(props.canRemove)

    for (const id of testIdButtons) {
      const wrapperButton = { wrapper: getWrapperElement({ wrapper, testId: id }) }

      // Check correct text each element
      testOn.equalTextValue(wrapperButton, i18n.t(`action.${id}`))
    }
  })

  it('Call correct actions', async () => {
    const wrapper = getMountMultipleActions(props, global)

    const testIdButtons = getTestIdButtons(props.canRemove)

    for (const id of testIdButtons) {
      const wrapperButton = { wrapper: getWrapperElement({ wrapper, testId: id }) }

      await clickTrigger(wrapperButton)

      /// Check call event emit after click
      testOn.isCalledEmitEvent({ wrapper }, `on-${id}`)
    }
  })

  it('Check quantity button by props canRemove', async () => {
    const wrapper = getMountMultipleActions(props, global)

    const params = { wrapper, selector: 'button', all: true }

    /// When can`t remove
    testOn.checkLengthElements(params, getTestIdButtons(false).length)

    /// Update props
    await wrapper.setProps({ canRemove: true })

    /// When can remove
    testOn.checkLengthElements(params, getTestIdButtons(true).length)
  })

  it('Check number selected', async () => {
    const wrapper = getMountMultipleActions(props, global)

    const testId = 'number-selected'

    testOn.existTextValue({ wrapper, testId }, props.numberSelectedItems)

    // Update props value with numberSelectedItems
    const updatedNumber = 123

    await wrapper.setProps({ numberSelectedItems: updatedNumber })

    testOn.existTextValue({ wrapper, testId }, updatedNumber)
  })
  it('Check style params all buttons', async () => {
    props.canRemove = true

    const wrapper = getMountMultipleActions(props, global)

    /// Check all button
    getTestIdButtons(props.canRemove).forEach((id: string) => {
      const exceptedColor = id.includes('remove') ? VColors.Error : VColors.Secondary

      testOn.existClass({ wrapper, testId: id }, `text-${exceptedColor}`)

      testOn.existClass({ wrapper, testId: id }, `v-btn--variant-${VVariants.Outlined}`)

      testOn.existClass({ wrapper, testId: id }, `v-btn--size-${VSizes.Small}`)
    })
  })

  it('Show confirm modal on click remove and exist only remove', async () => {
    props.canRemove = true
    props.action = MultipleActionsEnum.Remove

    const wrapper = getMountMultipleActions(props, global)
    const modalSpy = vi.spyOn(mockModal, 'showModal')

    testOn.notExistElement({ wrapper, testId: 'activate' })
    testOn.notExistElement({ wrapper, testId: 'deactivate' })

    await clickTrigger({ wrapper, testId: 'remove' })

    expect(modalSpy).toHaveBeenCalledWith(ModalsId.MultipleRemoveList)
  })

  it('Render all actions', async () => {
    props.action = null
    props.canRemove = true

    const wrapper = getMountMultipleActions(props, global)

    testOn.existElement({ wrapper, testId: 'activate' })
    testOn.existElement({ wrapper, testId: 'deactivate' })
    testOn.existElement({ wrapper, testId: 'remove' })
  })
})
