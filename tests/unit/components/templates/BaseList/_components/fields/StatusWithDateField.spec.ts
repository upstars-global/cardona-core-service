import { beforeEach, describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import StatusWithDateField from '../../../../../../../src/components/templates/BaseList/_components/fields/StatusWithDateField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { VColors, VVariants } from '../../../../../../../src/@model/vuetify'
import { fullDate } from '../../../../../../../src/utils/date'

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

  it('Check render elements byDefaultProps from test ', () => {
    const wrapper = getMountStatusWithDateField(props)

    /// Check render status of status field
    testOn.existClass({ wrapper, testId: testIds.statusField }, `text-${VColors.Success}`)

    testOn.existClass({ wrapper, testId: testIds.statusField }, `v-chip--variant-${VVariants.Tonal}`)
    testOn.equalTextValue({ wrapper, testId: testIds.statusFieldText }, 'Active')

    /// Check render date field

    const dateFieldWrapper = getDateFieldWrapper(wrapper)

    testOn.existElement({ wrapper: dateFieldWrapper })
    testOn.equalTextValue({ wrapper: dateFieldWrapper }, fullDate(new Date(props.item.updatedAt)))
  })

  it('Test on empty params of date ', () => {
    props.item.updatedAt = null

    const wrapper = getMountStatusWithDateField(props)

    const dateFieldWrapper = getDateFieldWrapper(wrapper)

    testOn.existElement({ wrapper: dateFieldWrapper })
    testOn.equalTextValue({ wrapper: dateFieldWrapper }, '-')
  })
})
