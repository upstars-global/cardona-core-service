import { beforeEach, describe, it } from 'vitest'
import { mapValues } from 'lodash'
import { setMountComponentSelect } from '../shared-tests/select-field'
import NumberRangeField from '../../../../src/components/templates/FieldGenerator/_components/NumberRangeField.vue'
import { getWrapperElement } from '../../utils'
import {
  testActiveErrorAndDisabled,
  testDefaultStateErrorAndDisabled, testOnUpdatedValue,
  testRenderContentItems,
} from '../shared-tests/number-field'

const getMountNumberRangeField = setMountComponentSelect(NumberRangeField)

let props

const field = {
  placeholder: 'Some number value',
  append: '%',
}

const defaultProps = {
  modelValue: '',
  field,
}

const inputRangeTestIds = ['from', 'to']

beforeEach(() => {
  props = defaultProps
})

describe('NumberRangeField', () => {
  it('Check render content items ', async () => {
    const wrapper = getMountNumberRangeField(props)
    const inputsRange = inputRangeTestIds.map(testId => getWrapperElement({ wrapper, testId }))

    await testRenderContentItems(inputsRange[0], { props, placeholder: `${field.placeholder} From` })

    await testRenderContentItems(inputsRange[1], { props, placeholder: `${field.placeholder} To` })

    /// Checking inputs with default states error and disabled
    inputsRange.forEach(testDefaultStateErrorAndDisabled)

    await wrapper.setProps({ disabled: true, errors: true })

    /// Checking inputs with active states error and disabled
    inputsRange.forEach(testActiveErrorAndDisabled)
  })

  it('Is working update model value ', async () => {
    const valueToSet = { from: '11', to: '22' }

    const wrapper = getMountNumberRangeField(props)

    await testOnUpdatedValue(wrapper, { valueToSet, expectedValue: valueToSet })
  })

  it('Check on only integer numbers ', async () => {
    props.field.isIntegerNumbers = true

    const valueToSet = { from: '11.11', to: '22.22' }
    const expectedValue = mapValues(valueToSet, value => value.replace('.', ''))

    const wrapper = getMountNumberRangeField(props)

    await testOnUpdatedValue(wrapper, { valueToSet, expectedValue })
  })

  it('Check on only positive numbers ', async () => {
    props.field.withPositiveNumbers = true

    const valueToSet = { from: '-11', to: '-22' }
    const expectedValue = mapValues(valueToSet, value => value.replace('-', ''))

    const wrapper = getMountNumberRangeField(props)

    await testOnUpdatedValue(wrapper, { valueToSet, expectedValue })
  })
})
