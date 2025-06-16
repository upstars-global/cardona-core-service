import { beforeEach, describe, it, vi } from 'vitest'
import { createStore } from 'vuex'
import { getSelectorTestId, setMountComponentWithGlobal } from '../utils'
import DynamicFieldList from '../../../src/components/DynamicFieldList.vue'
import { SelectBaseField, TextBaseField } from '../../../src/@model/templates/baseField'
import type { OptionsItem } from '../../../src/@model'
import { testOn } from '../templates/shared-tests/test-case-generator'

interface Props {
  modelValue: { text: TextBaseField; select: SelectBaseField }[]
  templateField: Function
  disabled?: boolean
  required?: boolean
  allowAddWithEmpty?: boolean
  hideLabelOnEmptyList?: boolean
  fieldCol?: number | string
}

const mockStore = createStore({
  getters: {
    'abilityCan': () => vi.fn(() => true),
    'appConfigCore/allCurrencies': vi.fn(() => ['USD', 'EUR', 'CAD']),
  },
})

const getMountComponent = setMountComponentWithGlobal<Props>(DynamicFieldList, {
  plugins: [mockStore],
  components: {
    VueSelect: {
      props: ['modelValue', 'options'],
      template: '<div class="vue-select-mock">{{ modelValue }}</div>',
    },
  },
})

const templateField = (data?: { text: string; select: string | OptionsItem }): {
  text: TextBaseField
  select: SelectBaseField
} => ({
  text: new TextBaseField({
    key: 'text',
    value: data?.text,
    label: 'Some label',
  }),
  select: new SelectBaseField({
    key: 'select',
    value: data?.select,
    label: 'Some select',
    options: Array
      .from({ length: 3 })
      .map((_, index) => ({
        id: `${index + 1}`,
        name: `Option ${index + 1}`,
      })),
  }),
})

const defaultProps = {
  templateField,
  modelValue: [templateField({ text: 'Text value', select: '1' })],
}

export const dataTestIds = {
  rowLabel: 'row-label',
  singleFieldLabel: 'single-field-label',
  singleField: (index: number) => `single-field-${index}`,
  label: (index: number) => `label-${index}`,
  rowCol: (row: number, col: number) => `row-${row}-col-${col}`,
  field: (row: number, key: string) => `field-${row}-${key}`,
  buttonRemove: 'button-remove',
  buttonAdd: 'button-add',
} as const

let props: Props

beforeEach(() => {
  props = defaultProps
})

describe('DynamicFieldList', () => {
  it('Should render base state', async () => {
    const wrapper = getMountComponent(props)

    console.log(wrapper.html())
    testOn.existTextValue({ wrapper, selector: `${getSelectorTestId('field-0-text')} label` }, props.modelValue[0].text.label)
    testOn.existTextValue({ wrapper, selector: `${getSelectorTestId('field-0-select')} label` }, props.modelValue[0].select.label)
  })
})
