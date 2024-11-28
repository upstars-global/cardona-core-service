import { beforeEach, describe, it } from 'vitest'
import StatusField from '../../../../../../../src/components/templates/BaseList/_components/fields/StatusField.vue'
import { setMountComponent } from '../../../../../utils'
import { VColors, VVariants } from '../../../../../../../src/@model/vuetify'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { StatusWithVariant } from '../../../../../../../src/@model/view'

const getMountStatusField = setMountComponent(StatusField)

enum TestStatuses {
  inProgress = 'warning',
  active = 'primary',
  pause = 'secondary',
  finished = 'success',
}

const defaultProps = {
  value: 'active',
  variant: VVariants.Outlined,
  rounded: false,
}

let props

const testIds = {
  statusField: 'status-field',
  statusFieldText: 'status-field-text',
}

describe('StatusField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Check exist actual class by value and variant ', () => {
    const wrapper = getMountStatusField(props)

    testOn.existClass({ wrapper, testId: testIds.statusField }, `text-${VColors.Success}`)
    testOn.existClass({ wrapper, testId: testIds.statusField }, `v-chip--variant-${VVariants.Outlined}`)
    testOn.equalTextValue({ wrapper, testId: testIds.statusFieldText }, 'Active')
  })

  it('Check exist actual class by value and variant ', () => {
    const state = 'inProgress'

    props.value = new StatusWithVariant(state, TestStatuses[state])

    const wrapper = getMountStatusField(props)

    testOn.existClass({ wrapper, testId: testIds.statusField }, `text-${TestStatuses[state]}`)
    testOn.existClass({ wrapper, testId: testIds.statusField }, `v-chip--variant-${VVariants.Outlined}`)
    testOn.equalTextValue({ wrapper, testId: testIds.statusFieldText }, 'InProgress')
  })

  it('Render status field with params rounded', async () => {
    const wrapper = getMountStatusField(props)

    const expectedValue = 'v-chip--label'

    testOn.existClass({ wrapper, testId: testIds.statusField }, expectedValue)

    /// Update props and set rounded to true
    await wrapper.setProps({ rounded: true })

    testOn.notExistClasses({ wrapper, testId: testIds.statusField }, expectedValue)
  })
})
