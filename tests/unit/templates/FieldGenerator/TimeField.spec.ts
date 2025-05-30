import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import TimeField from '../../../../src/components/templates/FieldGenerator/_components/TimeField.vue'
import { setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'

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
  useI18n: () => ({ locale: { value: 'en' } }),
}))

let warnSpy: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  warnSpy = vi.spyOn(console, 'warn').mockImplementation((msg) => {
    if (typeof msg === 'string' && msg.includes('Symbol(route location)')) return
  })

  const pinia = createPinia()
  setActivePinia(pinia)
})

afterEach(() => {
  warnSpy.mockRestore()
})

describe('TimeField.vue', () => {
  it('Check on valid update value by v-model', async () => {
    const wrapper = getMountTimeField(defaultProps)
    await wrapper.setValue(timeValue)
    testOn.isCalledEmitEventValue({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: timeValue })
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
