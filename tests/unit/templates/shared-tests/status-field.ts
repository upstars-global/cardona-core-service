import { describe, it } from 'vitest'
import { VColors, VVariants } from '../../../../src/@model/vuetify'
import { getWrapperWithId, testOn } from './test-case-generator'

const testIdStatusField = 'status-field'

export const runTestCaseForStatusField = (describeTitle, mountMethod) => {
  describe(describeTitle, () => {
    it('Renders correctly when the status is not in the StatusVariants enum', () => {
      const wrapper = mountMethod({
        value: 'unknown_status',
        variant: VVariants.Outlined,
      })

      const currentElement = getWrapperWithId({ wrapper, testId: testIdStatusField })

      testOn.equalTextValue({ wrapper }, 'Unknown status')

      console.log(currentElement.wrapper.html())

      testOn.existClass(currentElement, `text-${VColors.Secondary}`)

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
