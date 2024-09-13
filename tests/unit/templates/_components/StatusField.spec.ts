import { describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import StatusField from '../../../../src/components/templates/_components/StatusField.vue'
import { getSelectorTestId, setMountComponent } from '../../utils'

import { StatusVariants } from '../../../../src/@model/enums/statusField'
import {VColors, VVariants} from '../../../../src/@model/vuetify'

const getMountStatusField = setMountComponent(StatusField)

const statusKeys = Object.keys(StatusVariants) as Array<keyof typeof StatusVariants>

const getChipFromWrapper = (wrapper: VueWrapper) => wrapper.findComponent({ name: 'VChip' })

describe('StatementField', () => {
  statusKeys.forEach(value => {
    it(`Renders correctly color for status ${value}`, () => {
      const wrapper = getMountStatusField({ value })

      expect(wrapper.find(getSelectorTestId('status-field')).classes()).includes(`text-${StatusVariants[value]}`)
    })
  })

  it('Renders correctly when the status is not in the StatusVariants enum', () => {
    const wrapper = getMountStatusField({
      value: 'unknown_status',
      variant: VVariants.Outlined,
    })

    expect(wrapper.text()).toBe('Unknown status')

    const chip = getChipFromWrapper(wrapper)

    expect(chip.props('color')).toBe(VColors.Secondary)
    expect(chip.props('variant')).toBe(VVariants.Outlined)
  })

  it('Uses the default variant when no variant is provided', () => {
    const wrapper = getMountStatusField({
      value: '',
    })

    expect(getChipFromWrapper(wrapper).props('variant')).toBe(VVariants.Tonal)
  })

  it('Renders a custom status and variant when passed as object', () => {
    const variant = 'custom-variant'

    const wrapper = getMountStatusField({
      value: { status: 'custom_status', variant },
      variant: VVariants.Flat,
    })

    expect(wrapper.text()).toBe('Custom status')

    const chip = getChipFromWrapper(wrapper)

    expect(chip.props('color')).toBe(variant)
    expect(chip.props('variant')).toBe(VVariants.Flat)
  })
})
