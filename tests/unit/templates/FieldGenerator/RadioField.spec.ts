import { describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import RadioField from '../../../../src/components/templates/FieldGenerator/_components/RadioField.vue'
import { getWrapperElement, setMountComponent } from '../../utils'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'

const getMountRadioField = setMountComponent(RadioField)

const field = {
  key: 'radioTest',
  label: 'Test Radio Label',
  options: [
    { text: 'Option 1', value: 'option1' },
    { text: 'Option 2', value: 'option2' },
    { text: 'Option 3', value: 'option3' },
  ],
}

const defaultProps = {
  modelValue: false,
  field,
}

describe('RadioField.vue', () => {
  it('Render valid options ', () => {
    const wrapper = getMountRadioField(defaultProps)

    const radioOptions = getWrapperElement({ wrapper, testId: 'radio-option', all: true }) as Array<VueWrapper>

    radioOptions.forEach((radioOption, index) => {
      testOn.equalTextValue(
        {
          wrapper: radioOption,
          selector: 'label',
        },
        field.options[index].text)
    })
  })
  it('Check state on actual model value ', async () => {
    const wrapper = getMountRadioField(defaultProps)

    await wrapper.setProps({ modelValue: field.options[0].value })

    testOn.checkedElementToBe({ wrapper: wrapper.findAll('input')[0] }, true)

    await wrapper.setValue(field.options[1].value)

    testOn.isCalledEmitEventValue({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: field.options[1].value })
  })
})
