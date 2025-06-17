import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { clickTrigger, getSelectorTestId, getWrapperElement, setMountComponentWithGlobal } from '../utils'
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

  it('Should add item list ', async () => {
    const FIELD_LENGTH_START: number = props.modelValue?.length

    props.allowAddWithEmpty = true

    const wrapper = getMountComponent(props)

    /// Trigger click action on add new field
    await clickTrigger({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonAdd)}` })

    /// Check chat is called actual event
    testOn.isCalledEmitEvent({ wrapper }, 'on-add-item')

    /// Check that item from event emmit has correct field keys
    expect(Object.keys(wrapper.emitted()['on-add-item'][0][0].item)).eqls(['text', 'select'])

    await nextTick()

    const allFields = wrapper.findAll('.filed-list__item')

    /// Check that amount of fields is on one
    expect(allFields.length).toBe(FIELD_LENGTH_START + 1)

    const actualIndex = allFields.length - 1

    /// Check that added field in right
    testOn.existElement({ wrapper, selector: getSelectorTestId(dataTestIds.field(actualIndex, 'text')) })
    testOn.existElement({ wrapper, selector: getSelectorTestId(dataTestIds.field(actualIndex, 'select')) })
  })

  it('Should render valid disabled state', async () => {
    const FIELD_LENGTH_START: number = props.modelValue?.length

    props.disabled = true
    props.allowAddWithEmpty = true

    const wrapper = getMountComponent(props)

    /// Check that button add is not rendering
    testOn.notExistElement({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonAdd)}` })

    const allFields = wrapper.findAll('.filed-list__item')

    /// Check that amount of fields exist
    expect(allFields.length).toBe(FIELD_LENGTH_START)

    /// Check a test case for each row's fields
    allFields.forEach((field, index) => {
      /// Check that button remove is not rendering
      testOn.notExistElement({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonRemove(index))}` })

      /// Check that field input is disabled
      testOn.isDisabledElement({ wrapper: field, selector: 'input' })
    })
    props.disabled = false
  })

  it('Should render correct col', () => {
    props.modelValue = getTemplateFields(5, templateField)

    /// Set custom vol for each field
    props.fieldCol = 2

    const wrapper = getMountComponent(props)
    const allFields = wrapper.findAll('.filed-list__item')

    /// Run by row
    allFields.forEach((field, rowIndex) => {
      /// Run by cull
      Object.keys(templateField()).forEach((_, colIndex) => {
        /// Check exist actual col value
        testOn.existClass({ wrapper: field, selector: `${getSelectorTestId(dataTestIds.rowCol(rowIndex, colIndex))}` }, 'v-col-md-2')
        testOn.existClass({ wrapper: field, selector: `${getSelectorTestId(dataTestIds.rowCol(rowIndex, colIndex))}` }, 'v-col-md-2')
      })
    })
  })

  it('Should not render button remove on "required" props', () => {
    props.modelValue = getTemplateFields(5, templateField)
    props.required = true

    const wrapper = getMountComponent(props)
    const allFields = wrapper.findAll('.filed-list__item')

    /// Run by row
    allFields.forEach((field, rowIndex) => {
      /// Check that button remove exist not in first element
      if (!rowIndex)
        testOn.notExistElement({ wrapper: field, testId: dataTestIds.buttonRemove(rowIndex) })
    })
  })

  it('Should call "update:model-value"', async () => {
    props.modelValue = getTemplateFields(5, templateField)

    const wrapper = getMountComponent(props)
    const allFields = wrapper.findAll('.filed-list__item')

    const SOME_VALUE = 'Some changed text value'
    const someFieldWrapper = allFields[0]

    const input = getWrapperElement({ wrapper: someFieldWrapper, selector: 'input' }) as VueWrapper

    await input.setValue(SOME_VALUE)

    wrapper.vm.$emit('update:model-value', wrapper.vm.modelValue)

    // Set event handler value
    const expectedValue = wrapper.emitted()['update:model-value'][0][0][0].text.value

    expect(expectedValue).toBe(SOME_VALUE)
  })
})
