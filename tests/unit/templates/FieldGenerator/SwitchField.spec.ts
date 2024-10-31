import { describe, it } from 'vitest'
import SwitchField from '../../../../src/components/templates/FieldGenerator/_components/SwitchField.vue'
import { setMountComponent } from '../../utils'
import { VColors, VSizes } from '../../../../src/@model/vuetify'
import { testOn } from '../shared-tests/test-case-generator'
import { IconsList } from '../../../../src/@model/enums/icons'
import { getCheckBoxElement } from '../shared-tests/checkbox-field'

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

describe('SwitchField', () => {
  it('Render switch elements and styles with params withState', async () => {
    const wrapper = getMountSwitchField(defaultProps)

    testOn.existClass({ wrapper, testId: 'icon-state' }, IconsList.CheckCircleIcon)
    testOn.existClass({ wrapper, testId: 'icon-state' }, `text-${VColors.Success}`)

    testOn.isEqual({ wrapper: getCheckBoxElement(wrapper).element.checked }, true)

    await wrapper.setProps({ ...defaultProps, modelValue: false })

    testOn.isEqual({ wrapper: getCheckBoxElement(wrapper).element.checked }, false)

    testOn.existClass({ wrapper, testId: 'icon-state' }, IconsList.XCircleIcon)
    testOn.existClass({ wrapper, testId: 'icon-state' }, `text-${VColors.Error}`)
  })
})
