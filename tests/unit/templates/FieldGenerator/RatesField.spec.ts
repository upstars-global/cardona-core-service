import { beforeEach, describe, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import RatesField from '../../../../src/components/templates/FieldGenerator/_components/RatesField.vue'
import { setMountComponent } from '../../utils'
import { RatesBaseField } from '../../../../src/@model/templates/baseField'
import { testOn } from '../shared-tests/test-case-generator'
import type { IRatesBaseField, RatesValueItem } from '../../../../src/@model/templates/baseField/rates'
import { textOnEqualDataAndValueInput } from '../shared-tests/rates'

const getMountRatesField = setMountComponent(RatesField)

const mockStore = {
  getters: {
    'appConfigCore/allCurrencies': ['USD', 'EUR', 'CAD'],
  },
  dispatch: vi.fn(),
}

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => mockStore, // Мокаем useStore
  }
})

describe('RatesField.vue', () => {
  const modelValue = [
    { currency: 'USD', value: 10 },
    { currency: 'EUR', value: 20 },
    { currency: 'CAD', value: 30 },
  ]

  const modelValueWithValueText = [
    { currency: 'USD', value: '10 + 10spins' },
    { currency: 'EUR', value: '20 + 20spins' },
    { currency: 'CAD', value: '30 + 30spins' },
  ]

  const getRatesField = (params?: IRatesBaseField) => new RatesBaseField({
    key: 'rate',
    label: 'Exchange Rates',
    placeholder: 'Enter rate',
    validationRules: {},
    ...params,
  })

  const defaultProps = {
    modelValue,
    field: getRatesField(),
    disabled: false,
    append: '%',
  }

  beforeEach(() => {
    mockStore.dispatch.mockClear()
  })

  it('Render elements of wrapper input ', async () => {
    const wrapper = getMountRatesField(defaultProps)

    testOn.equalTextValue({ wrapper, testId: 'label' }, defaultProps.field.label)
    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, defaultProps.field.placeholder)

    const infoIconTestId = 'icon-info'

    testOn.notExistElement({ wrapper, testId: infoIconTestId })

    await wrapper.setProps({ field: { info: 'Some info text' } })

    testOn.existElement({ wrapper, testId: infoIconTestId })
  })

  it('Render correct content and input value with filled modelValue', async () => {
    const wrapper = getMountRatesField(defaultProps) as VueWrapper
    const labels = wrapper.findAll('label span') /// labels of input
    const appends = wrapper.findAll('.v-text-field__suffix__text') /// append content of inputs

    textOnEqualDataAndValueInput(wrapper, modelValue, index => {
      testOn.equalTextValue({ wrapper: appends[index] }, defaultProps.append)
      testOn.existTextValue({ wrapper: labels[index] }, modelValue[index].currency)
    })
  })

  it('Update  modelValue of component', async () => {
    const updatedModelValue = [...modelValue]
      .map((
        item: Required<RatesValueItem>,
      ) => ({ ...item, value: item.value * 2 }))

    const wrapper = getMountRatesField(defaultProps) as VueWrapper

    testOn.checkLengthElements({ wrapper, selector: 'input', all: true }, updatedModelValue.length)

    for (const value of updatedModelValue) {
      const index = updatedModelValue.indexOf(value)
      const input = wrapper.findAll('input')[index]

      await input.setValue(value.value)
    }

    textOnEqualDataAndValueInput(wrapper, updatedModelValue)
  })

  it('Should allow set string value into RatesField', async () => {
    const props = {
      modelValue: modelValueWithValueText,
      field: getRatesField({ withString: true }),
      disabled: false,
      append: '%',
    }

    const wrapper = getMountRatesField(props) as VueWrapper

    textOnEqualDataAndValueInput(wrapper, modelValueWithValueText)
  })
  it('Should be empty input value if withString false', async () => {
    const expectedValue = modelValueWithValueText.map(item => ({ ...item, value: '' }))

    const props = {
      modelValue: modelValueWithValueText,
      field: getRatesField(),
      disabled: false,
      append: '%',
    }

    const wrapper = getMountRatesField(props) as VueWrapper

    textOnEqualDataAndValueInput(wrapper, expectedValue)
  })
})
