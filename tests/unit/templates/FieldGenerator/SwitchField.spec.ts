import { describe, it } from 'vitest'
import SwitchField from '../../../../src/components/templates/FieldGenerator/_components/SwitchField.vue'
import { setMountComponent } from '../../utils'
import { VColors, VSizes } from '../../../../src/@model/vuetify'
import { testOn } from '../shared-tests/test-case-generator'
import { IconsList } from '../../../../src/@model/enums/icons'
import { getCheckBoxElement } from '../shared-tests/checkbox-field'
import { expectedEmitValue } from '../shared-tests/general'

const getMountSwitchField = setMountComponent(SwitchField)

const field = {
  key: 'testSwitch',
  label: 'Test Switch Label',
  value: true,
  withState: true,
}

const defaultProps = {
  modelValue: true,
  field,
  size: VSizes.Medium,
  disabled: false,
}

const selector = '.v-selection-control'
const classSelectorControllDisabled = 'v-selection-control--disabled'

describe('SwitchField', () => {
  it('Render switch elements and styles with params withState', async () => {
    const wrapper = getMountSwitchField(defaultProps)

    testOn.existClass({ wrapper, testId: 'icon-state' }, IconsList.CheckCircleIcon)
    testOn.existClass({ wrapper, testId: 'icon-state' }, `text-${VColors.Success}`)

    testOn.isEqual({ wrapper: getCheckBoxElement(wrapper).element.checked }, true)

    await wrapper.setProps({ modelValue: false })

    testOn.isEqual({ wrapper: getCheckBoxElement(wrapper).element.checked }, false)

    testOn.existClass({ wrapper, testId: 'icon-state' }, IconsList.XCircleIcon)
    testOn.existClass({ wrapper, testId: 'icon-state' }, `text-${VColors.Error}`)
  })

  it('Check event and event value', async () => {
    const wrapper = getMountSwitchField(defaultProps)

    /// Set value false
    await wrapper.setValue(false)
    testOn.isCalledEmittedEvent({ wrapper })
    expectedEmitValue(wrapper, false)

    /// Set value true
    await wrapper.setValue(true)
    testOn.isCalledEmittedEvent({ wrapper })
    expectedEmitValue(wrapper, true, 1)
  })

  it('Check size param', async () => {
    const wrapper = getMountSwitchField({ ...defaultProps, size: VSizes.Small })

    testOn.existClass({ wrapper, testId: 'switch-wrapper' }, `size-${VSizes.Small}`)
  })

  it('Check disabled param', async () => {
    const wrapper = getMountSwitchField({ ...defaultProps, disabled: true })

    testOn.existClass({ wrapper, selector }, classSelectorControllDisabled)

    await wrapper.setProps({ disabled: false })

    testOn.notExistClasses({ wrapper, selector }, classSelectorControllDisabled)
  })
})
