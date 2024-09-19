import { describe, it } from 'vitest'
import StatusField from '../../../../src/components/templates/_components/StatusField.vue'
import {
  setMountComponent,
} from '../../utils'

import { StatusVariants } from '../../../../src/@model/enums/statusField'
import { VColors, VVariants } from '../../../../src/@model/vuetify'
import { getWrapperWithId, testOn } from '../shared-tests/test-case-generator'

const getMountStatusField = setMountComponent(StatusField)

const statusKeys = Object.keys(StatusVariants) as Array<keyof typeof StatusVariants>

const testIdStatusField = 'status-field'

describe('StatementField', () => {
  statusKeys.forEach(value => {
    it(`Renders correctly color for status ${value}`, () => {
      const wrapper = getMountStatusField({ value })

      testOn.existClass({ wrapper, testId: testIdStatusField }, `text-${StatusVariants[value]}`)
    })
  })

  it('Renders correctly when the status is not in the StatusVariants enum', () => {
    const wrapper = getMountStatusField({
      value: 'unknown_status',
      variant: VVariants.Outlined,
    })

    const currentElement = getWrapperWithId({ wrapper, testId: testIdStatusField })

    testOn.equalTextValue({ wrapper }, 'Unknown status')
    testOn.existClass(currentElement, `text-${VColors.Secondary}`)
    testOn.existClass(currentElement, `v-chip--variant-${VVariants.Outlined}`)
  })

  it('Uses the default variant when no variant is provided', () => {
    const wrapper = getMountStatusField({
      value: '',
    })

    testOn.existClass({ wrapper, testId: testIdStatusField }, `v-chip--variant-${VVariants.Tonal}`)
  })

  it('Renders a custom status and variant when passed as object', () => {
    const variant = 'custom-variant'

    const wrapper = getMountStatusField({
      value: { status: 'custom_status', variant },
      variant: VVariants.Flat,
    })

    const currentElement = getWrapperWithId({ wrapper, testId: testIdStatusField })

    testOn.equalTextValue({ wrapper }, 'Custom status')
    testOn.existClass(currentElement, `bg-${variant}`)
    testOn.existClass(currentElement, `v-chip--variant-${VVariants.Flat}`)
  })
})
