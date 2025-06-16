import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import { nextTick } from 'vue'
import { clickTrigger, getSelectorTestId, setMountComponentWithGlobal } from '../utils'
import DynamicFieldList from '../../../src/components/DynamicFieldList.vue'
import type { BaseField } from '../../../src/@model/templates/baseField'
import { SelectBaseField, TextBaseField } from '../../../src/@model/templates/baseField'
import type { OptionsItem } from '../../../src/@model'
import { testOn } from '../templates/shared-tests/test-case-generator'

type DynamicField = BaseField | Record<string, BaseField>

interface Props {
  modelValue: DynamicField
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
    id: Math.random().toString(),
    value: data?.text,
    label: 'Some label',
  }),
  select: new SelectBaseField({
    key: 'select',
    id: Math.random().toString(),
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

const getTemplateFields = (length: number, templateMethod: CallableFunction) => Array.from({ length }).fill(null).map(() => templateMethod())
const getSingleField = (value?: string) => (new TextBaseField({ key: 'text', id: Math.random().toString(), value, label: 'Text single label' }))

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
  buttonRemove: (index: number) => `button-remove-${index}`,
  buttonAdd: 'button-add',
} as const

let props: Props

beforeEach(() => {
  props = defaultProps
})

describe('DynamicFieldList', () => {
  it('Should render label each field', async () => {
    props.modelValue = getTemplateFields(5, templateField)

    const wrapper = getMountComponent(props)

    /// Check that render each label of each field
    props.modelValue.forEach((field, index) => {
      testOn.existTextValue({ wrapper, selector: `${getSelectorTestId(dataTestIds.field(index, 'text'))} label` }, field.text.label)
      testOn.existTextValue({ wrapper, selector: `${getSelectorTestId(dataTestIds.field(index, 'select'))} label` }, field.select.label)

      /// Check that exist button remove
      testOn.existElement({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonRemove(index))}` })
    })

    /// Exist Button add
    testOn.existElement({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonAdd)}` })
  })

  it('Should render single field', async () => {
    props.modelValue = getTemplateFields(5, () => getSingleField('Text value')) as TextBaseField[]

    const wrapper = getMountComponent(props)

    /// Run test for each field
    props.modelValue.forEach((field, index) => {
      /// Check that is rendering label of field
      testOn.existTextValue({ wrapper, selector: `${getSelectorTestId(dataTestIds.singleField(index))}` }, field.label)

      /// Check actual value for input
      expect(wrapper.find(`${getSelectorTestId(dataTestIds.singleField(index))} input`).element.value).toBe(field.value)

      /// Check that exist button remove
      testOn.existElement({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonRemove(index))}` })
    })

    /// Exist button add
    testOn.existElement({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonAdd)}` })
  })

  it('Should remove item of list ', async () => {
    const AMOUNT_FIELDS = 5
    const REMOVE_FIELD_INDEX = 1

    /// Init model value
    props.modelValue = getTemplateFields(AMOUNT_FIELDS, getSingleField) as TextBaseField[]

    /// Set uniq label for each field to easer identification list's state
    props.modelValue.forEach((field, index) => {
      field.label = `item-${index}`
    })

    const wrapper = getMountComponent(props)

    expect(wrapper.findAll('.filed-list__item').length).toBe(AMOUNT_FIELDS)
    await clickTrigger({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonRemove(REMOVE_FIELD_INDEX))}` })

    await nextTick()

    expect(wrapper.findAll('.filed-list__item').length).toBe(AMOUNT_FIELDS - 1)

    /// Get field on new potion
    const wrapperOnNewPositionOFList = wrapper.findAll('.filed-list__item')[REMOVE_FIELD_INDEX]

    // Check that field on new position has correct label
    testOn.existTextValue({ wrapper: wrapperOnNewPositionOFList, selector: 'label' }, 'item-2')
  })
})
