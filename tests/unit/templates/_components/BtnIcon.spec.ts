import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { IconsList } from '../../../../src/@model/enums/icons'
import { VColors } from '../../../../src/@model/vuetify'
import BtnIcon from '../../../../src/components/templates/_components/BtnIcon.vue'
import {
  getSelectorTestId,
  setMountComponent,
} from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'

const getMountBtnIcon = setMountComponent(BtnIcon)

function assertClickEvent(wrapper: VueWrapper, expectedPayload: boolean | null) {
  const clickEvents = wrapper.emitted('click')
  if (expectedPayload !== null) {
    expect(clickEvents).toBeTruthy()
    expect(clickEvents[0]).toEqual([expectedPayload])
  }
  else {
    expect(clickEvents).toBeFalsy()
  }
}
describe('BtnIcon', () => {
  it('computes the correct state color based on value prop', async () => {
    const wrapper = getMountBtnIcon({
      value: true,
      icon: IconsList.CheckIcon,
    })

    const testId = 'button-icon__body'

    testOn.existClass({ wrapper, testId }, `text-${VColors.Success}`)

    await wrapper.setProps({ value: false })

    testOn.existClass({ wrapper, testId }, `text-${VColors.Error}`)
  })

  it('should apply correct classes based on isStatic prop', async () => {
    const wrapper = getMountBtnIcon({
      value: true,
      isStatic: true,
      icon: IconsList.CheckIcon,
    })

    testOn.existClass({ wrapper }, 'default-cursor')

    await wrapper.setProps({ isStatic: false })

    await nextTick()

    testOn.notExistClasses({ wrapper }, 'default-cursor')
  })

  it.each([
    { value: true, isStatic: false, expected: true, description: 'static is none' },
    { value: true, isStatic: true, expected: null, description: 'static is true' },
  ])(
    'emits a "click" event with the correct payload if $description',
    async ({ value, isStatic, expected }) => {
      const wrapper = getMountBtnIcon({
        value,
        isStatic,
        icon: IconsList.CheckIcon,
      })

      const button = wrapper.find(getSelectorTestId('button-icon__body'))

      await button.trigger('click')

      assertClickEvent(wrapper, expected)
    })
})
