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

const templateField = (data?: { text: string; select: string | OptionsItem }) => ({
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
    options: Array.from({ length: 3 }, (_, index) => ({
      id: `${index + 1}`,
      name: `Option ${index + 1}`,
    })),
  }),
})

const getTemplateFields = (count: number, fn: CallableFunction) => Array.from({ length: count }, () => fn())
const getSingleField = (value?: string) => new TextBaseField({ key: 'text', id: Math.random().toString(), value, label: 'Text single label' })

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
  props = { ...defaultProps }
})

describe('DynamicFieldList', () => {
  it('renders multiple fields with labels and remove buttons', async () => {
    props.modelValue = getTemplateFields(5, templateField)

    const wrapper = getMountComponent(props)

    props.modelValue.forEach((field, i) => {
      testOn.existTextValue({ wrapper, selector: `${getSelectorTestId(dataTestIds.field(i, 'text'))} label` }, field.text.label)
      testOn.existTextValue({ wrapper, selector: `${getSelectorTestId(dataTestIds.field(i, 'select'))} label` }, field.select.label)
      testOn.existElement({ wrapper, selector: `${getSelectorTestId(dataTestIds.buttonRemove(i))}` })
    })

    testOn.existElement({ wrapper, selector: getSelectorTestId(dataTestIds.buttonAdd) })
  })

  it('renders single field correctly', async () => {
    props.modelValue = getTemplateFields(5, () => getSingleField('Text value')) as TextBaseField[]

    const wrapper = getMountComponent(props)

    props.modelValue.forEach((field, i) => {
      testOn.existTextValue({ wrapper, selector: getSelectorTestId(dataTestIds.singleField(i)) }, field.label)
      expect(wrapper.find(`${getSelectorTestId(dataTestIds.singleField(i))} input`).element.value).toBe(field.value)
      testOn.existElement({ wrapper, selector: getSelectorTestId(dataTestIds.buttonRemove(i)) })
    })

    testOn.existElement({ wrapper, selector: getSelectorTestId(dataTestIds.buttonAdd) })
  })

  it('removes item from list', async () => {
    const fieldsCount = 5
    const fieldToRemoveIndex = 1

    props.modelValue = getTemplateFields(fieldsCount, getSingleField) as TextBaseField[]
    props.modelValue.forEach((f, i) => (f.label = `item-${i}`))

    const wrapper = getMountComponent(props)

    expect(wrapper.findAll('.filed-list__item')).toHaveLength(fieldsCount)

    await clickTrigger({ wrapper, selector: getSelectorTestId(dataTestIds.buttonRemove(fieldToRemoveIndex)) })
    await nextTick()

    expect(wrapper.findAll('.filed-list__item')).toHaveLength(fieldsCount - 1)

    const updatedField = wrapper.findAll('.filed-list__item')[fieldToRemoveIndex]

    testOn.existTextValue({ wrapper: updatedField, selector: 'label' }, 'item-2')
  })

  it('adds a new item to the list', async () => {
    const initialFieldsLength = props.modelValue.length

    props.allowAddWithEmpty = true

    const wrapper = getMountComponent(props)

    await clickTrigger({ wrapper, selector: getSelectorTestId(dataTestIds.buttonAdd) })

    testOn.isCalledEmitEvent({ wrapper }, 'on-add-item')
    expect(Object.keys(wrapper.emitted()['on-add-item'][0][0].item)).toEqual(['text', 'select'])

    await nextTick()

    const allFields = wrapper.findAll('.filed-list__item')

    expect(allFields).toHaveLength(initialFieldsLength + 1)

    const newIndex = allFields.length - 1

    testOn.existElement({ wrapper, selector: getSelectorTestId(dataTestIds.field(newIndex, 'text')) })
    testOn.existElement({ wrapper, selector: getSelectorTestId(dataTestIds.field(newIndex, 'select')) })
  })

  it('renders disabled state properly', async () => {
    props.disabled = true
    props.allowAddWithEmpty = true

    const wrapper = getMountComponent(props)

    testOn.notExistElement({ wrapper, selector: getSelectorTestId(dataTestIds.buttonAdd) })

    const allFields = wrapper.findAll('.filed-list__item')

    expect(allFields).toHaveLength(props.modelValue.length)

    allFields.forEach((field, i) => {
      testOn.notExistElement({ wrapper, selector: getSelectorTestId(dataTestIds.buttonRemove(i)) })
      testOn.isDisabledElement({ wrapper: field, selector: 'input' })
    })
  })

  it('renders correct column classes', () => {
    props.modelValue = getTemplateFields(5, templateField)
    props.fieldCol = 2

    const wrapper = getMountComponent(props)
    const allFields = wrapper.findAll('.filed-list__item')

    allFields.forEach((field, row) => {
      Object.keys(templateField()).forEach((_, col) => {
        const selector = getSelectorTestId(dataTestIds.rowCol(row, col))

        testOn.existClass({ wrapper: field, selector }, 'v-col-md-2')
      })
    })
  })

  it('hides remove button when required is true', () => {
    props.modelValue = getTemplateFields(5, templateField)
    props.required = true

    const wrapper = getMountComponent(props)
    const allFields = wrapper.findAll('.filed-list__item')

    allFields.forEach((field, i) => {
      if (i === 0)
        testOn.notExistElement({ wrapper: field, testId: dataTestIds.buttonRemove(i) })
    })
  })

  it('emits updated model value when input changes', async () => {
    props.modelValue = getTemplateFields(5, templateField)

    const wrapper = getMountComponent(props)
    const targetField = wrapper.findAll('.filed-list__item')[0]

    const input = getWrapperElement({ wrapper: targetField, selector: 'input' }) as VueWrapper

    await input.setValue('Some changed text value')

    wrapper.vm.$emit('update:model-value', wrapper.vm.modelValue)

    const emittedValue = wrapper.emitted()['update:model-value'][0][0][0].text.value

    expect(emittedValue).toBe('Some changed text value')
  })
})
