import { beforeEach, describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import StatusWithDateField from '../../../../../../../src/components/templates/BaseList/_components/fields/StatusWithDateField.vue'
import { setMountComponent } from '../../../../../utils'
import { VColors, VVariants } from '../../../../../../../src/@model/vuetify'
import { getTestCases } from '../../../../../templates/shared-tests/date-and-dateTimeField'
import { fullDate } from '../../../../../../../src/utils/date'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'

const getMountStatusWithDateField = setMountComponent(StatusWithDateField)

const testIds = {
  statusField: 'status-field',
  statusFieldText: 'status-field-text',
}

const defaultProps = {
  item: {
    status: 'active',
    variant: VVariants.Outlined,
    updatedAt: new Date('10.10.2025, 22:00'),
  },
}

const getDateFieldWrapper = (wrapper: VueWrapper): VueWrapper => wrapper.findComponent({ name: 'DateField' })

let props

describe('StatusWithDateField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  /// Run test list test cased for DateField in component

  getTestCases(fullDate).forEach(({ description, props: propsValue, expectedDate }) => {
    it(description, () => {
      props.item.updatedAt = propsValue.date

      /// Set to wrapper variable wrapper of component DateField which is using in StatusWithDateField
      const wrapper = getDateFieldWrapper(getMountStatusWithDateField(props))

      if (expectedDate instanceof Date)
        testOn.equalTextValue({ wrapper }, fullDate(expectedDate))
      else
        testOn.equalTextValue({ wrapper }, expectedDate)
    })
  })

  it('Check render elements byDefaultProps from test ', () => {
    const wrapper = getMountStatusWithDateField(props)

    /// Check render status of status field
    testOn.existClass({ wrapper, testId: testIds.statusField }, `text-${VColors.Success}`)

    testOn.existClass({ wrapper, testId: testIds.statusField }, `v-chip--variant-${VVariants.Tonal}`)
    testOn.equalTextValue({ wrapper, testId: testIds.statusFieldText }, 'Active')
  })
})
