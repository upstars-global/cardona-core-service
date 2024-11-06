import { beforeEach, describe, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import TimeField from '../../../../src/components/templates/FieldGenerator/_components/TimeField.vue'
import { setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { testOn } from '../shared-tests/test-case-generator'
import { expectedEmitValue } from '../shared-tests/general'

const getMountTimeField = setMountComponent(TimeField)

const timeValue = '13:45'

const defaultProps = {
  modelValue: '',
  field: {
    placeholder: 'Enter time',
    label: 'Time Label',
  },
  disabled: false,
  size: VSizes.Medium,
}

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'en' },
  }),
}))

beforeEach(() => {
  const pinia = createPinia()

  setActivePinia(pinia)
})

describe('TimeField.vue', () => {
  it('Check on valid update value by v-model', async () => {
    const wrapper = getMountTimeField(defaultProps)

    await wrapper.setValue(timeValue)
    expectedEmitValue(wrapper, timeValue)
  })

  it('Render placeholder', async () => {
    const wrapper = getMountTimeField(defaultProps)

    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, defaultProps.field.placeholder)
  })

  it('Update value with format time', async () => {
    const wrapper = getMountTimeField({ ...defaultProps, format: 'H:i:s' })

    await wrapper.setProps({ ...defaultProps, modelValue: timeValue })

    testOn.inputAttributeValueToBe({ wrapper, selector: 'input' }, `${timeValue}:0`)
  })
})
