import { describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import PasswordField from '../../../../src/components/templates/FieldGenerator/_components/PasswordField.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'
import { IconsList } from '../../../../src/@model/enums/icons'
import { i18n } from '../../../../src/plugins/i18n'
import generatePassword from '../../../../src/helpers/password-generator'
import { testOnCallEventEmmitAndEqualValue } from '../shared-tests/date-field'

const getMountPasswordField = setMountComponent(PasswordField)

const btnGeneratePasswordTestId = 'btn-generate-password'

describe('PasswordField.vue', () => {
  const field = {
    key: 'password',
    placeholder: 'Enter your password',
    withPasswordGenerator: true,
    showPassword: false,
  }

  const defaultProps = {
    modelValue: '',
    field,
    errors: false,
  }

  it('Check call event update model value', async () => {
    const wrapper = getMountPasswordField(defaultProps) as VueWrapper

    const modelValue = generatePassword()

    await wrapper.setValue(modelValue)

    testOnCallEventEmmitAndEqualValue(wrapper, modelValue)

    await wrapper.setProps({ modelValue })

    testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, modelValue)
  })

  it('Generate password functionality and render content', async () => {
    const wrapper = getMountPasswordField({ ...defaultProps, field: { ...field, withPasswordGenerator: false } }) as VueWrapper

    testOn.notExistElement({ wrapper, testId: btnGeneratePasswordTestId })

    await wrapper.setProps(defaultProps)
    testOn.existElement({ wrapper, testId: btnGeneratePasswordTestId })

    await clickTrigger({ wrapper, testId: btnGeneratePasswordTestId })
    testOn.isCalledEmittedEvent({ wrapper })

    testOn.equalTextValue(
      {
        wrapper,
        selector: `${getSelectorTestId('tooltip')}`,
      },
      i18n.t('common.generatePassword'))
  })

  it('Toggle show and hide password value', async () => {
    const wrapper = getMountPasswordField(defaultProps) as VueWrapper

    const iconForShowPassword = wrapper.find(`i.${IconsList.EyeIcon}`)

    testOn.inputTypeToBe({ wrapper, selector: 'input' }, 'password')

    await iconForShowPassword.trigger('click')

    testOn.notExistElement({ wrapper, selector: `i.${IconsList.EyeIcon}` })

    testOn.inputTypeToBe({ wrapper, selector: 'input' }, 'text')
  })
})
