import { describe, it } from 'vitest'
import { VVariants } from '../../../../src/@model/vuetify'
import { StatusWithVariant } from '../../../../src/@model/view'
import { convertUpperCaseFirstSymbol } from '../../../../src/helpers'
import { getWrapperWithId, testOn } from './test-case-generator'

const testIdStatusField = 'status-field'

export enum MockStatuses {
  hold = 'hold',
  active = 'active',
  inProgress = 'inProgress',
  removed = 'remove',
}

export enum MockStatusVariants {
  hold = 'secondary',
  active = 'success',
  inProgress = 'warning',
  removed = 'error',
}

export const runTestCaseForStatusField = (describeTitle, mountMethod) => {
  describe(describeTitle, () => {
    it('Renders correctly when the status is not in the StatusVariants enum', () => {
      const currentStatus = MockStatuses.active
      const value = new StatusWithVariant(currentStatus, MockStatusVariants[currentStatus])

      const wrapper = mountMethod({
        value,
        variant: VVariants.Outlined,
      })

      const currentElement = getWrapperWithId({ wrapper, testId: testIdStatusField })

      testOn.equalTextValue({ wrapper }, convertUpperCaseFirstSymbol(value.status))

      testOn.existClass(currentElement, `text-${value.variant}`)

      testOn.existClass(currentElement, `v-chip--variant-${VVariants.Outlined}`)
    })

    it('Uses the default variant when no variant is provided', () => {
      const wrapper = mountMethod({
        value: '',
      })

      testOn.existClass({ wrapper, testId: testIdStatusField }, `v-chip--variant-${VVariants.Tonal}`)
    })

    it('Renders a custom status and variant when passed as object', () => {
      const variant = 'custom-variant'

      const wrapper = mountMethod({
        value: { status: 'custom_status', variant },
        variant: VVariants.Flat,
      })

      const currentElement = getWrapperWithId({ wrapper, testId: testIdStatusField })

      testOn.equalTextValue({ wrapper }, 'Custom status')
      testOn.existClass(currentElement, `bg-${variant}`)
      testOn.existClass(currentElement, `v-chip--variant-${VVariants.Flat}`)
    })
  })
}
