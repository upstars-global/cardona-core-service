import { describe, it } from 'vitest'
import { nextTick } from 'vue'
import PhoneField from '../../../../src/components/templates/FieldGenerator/_components/PhoneField.vue'
import { setMountComponent } from '../../utils'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'
import { testOnCallEventEmitAndEqualValue } from '../shared-tests/date-field'

const getMountPhoneField = setMountComponent(PhoneField)

const phoneFlagTestId = 'phone-flag'
const fieldWrapperTestId = 'field-wrapper'

const field = {
  key: 'phoneTest',
  label: 'Phone Label',
}

const defaultProps = {
  modelValue: '',
  field,
}

const countryCodes = [
  { country: 'ua', code: '380' },
  { country: 'ca', code: '1' },
  { country: 'es', code: '34' },
  { country: 'pt', code: '351' },
]

describe('PhoneField.vue', () => {
  it('Render flag by valid phone number', async () => {
    const wrapper = getMountPhoneField(defaultProps)

    testOn.notExistElement({ wrapper, testId: phoneFlagTestId })

    for (const { country, code } of countryCodes) {
      await wrapper.setProps({ modelValue: code })

      testOn.existElement({ wrapper, testId: phoneFlagTestId })
      testOn.existClass({ wrapper, testId: phoneFlagTestId }, `fi-${country}`)
    }
  })

  it('Call event emited with correct value ', async () => {
    const wrapper = getMountPhoneField(defaultProps)

    await wrapper.setProps({ modelValue: countryCodes[0].code })

    testOnCallEventEmitAndEqualValue(wrapper, `+${countryCodes[0].code}`)

    await nextTick()

    await wrapper.setProps({ modelValue: `+${countryCodes[1].code}` })

    testOn.isCalledEmitEventValue(
      { wrapper }, {
        event: EventEmittersNames.UpdateVModel,
        value: `+${countryCodes[1].code}`,
        index: 1,
      })
  })

  it('State on focus input and on blur ', async () => {
    const paddingClass = 'pl-12'
    const selectorBgColor = '.bg-primary'

    const fieldWrapperClasses = [
      'v-field--active',
      'v-field--focused',
      paddingClass,
    ]

    const wrapper = getMountPhoneField({ ...defaultProps, modelValue: countryCodes[0].code })

    // On focus state

    await wrapper.find('input').trigger('focus')

    testOn.existElement({ wrapper, selector: selectorBgColor })

    fieldWrapperClasses.forEach(itemClass => {
      testOn.existClass({ wrapper, testId: fieldWrapperTestId }, itemClass)
    })

    // On blur state

    await wrapper.find('input').trigger('blur')

    testOn.notExistElement({ wrapper, selector: selectorBgColor })

    fieldWrapperClasses.filter(item => item !== paddingClass).forEach(itemClass => {
      testOn.notExistClasses({ wrapper, testId: fieldWrapperTestId }, itemClass)
    })

    await wrapper.setProps({ modelValue: '' })

    testOn.notExistClasses({ wrapper, testId: fieldWrapperTestId }, paddingClass)
  })
})
