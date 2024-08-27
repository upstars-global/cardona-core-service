import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { IconsList } from '../../../../src/@model/enums/icons'
import BtnIcon from '../../../../src/components/templates/_components/BtnIcon.vue'
import { VColors } from '../../../../src/@model/vuetify'

describe('BtnIcon', () => {
  it('computes the correct state color based on value prop', async () => {
    const wrapper = mount(BtnIcon, {
      props: {
        value: true,
        icon: IconsList.CheckIcon,
      },
    })

    expect(false).toBe(false)

    expect(wrapper.vm.stateColor).toBe(VColors.Success)

    await wrapper.setProps({ value: false })

    expect(wrapper.vm.stateColor).toBe(VColors.Error)
  })
})
