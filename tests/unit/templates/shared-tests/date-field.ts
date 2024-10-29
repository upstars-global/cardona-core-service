import moment from 'moment/moment'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { getSelectorTestId } from '../../utils'
import { router } from '../../../../src/plugins/1.router'
import DateField from '../../../../src/components/templates/FieldGenerator/_components/DateField.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'en' },
  }),
}))

beforeEach(() => {
  const pinia = createPinia()

  setActivePinia(pinia)
})

export const defaultProps = {
  modelValue: '2024-01-01T21:00:00.000Z',
  field: {
    withTime: true,
    isRangeMode: false,
    placeholder: 'Select date',
    label: 'Date Label',
    withInitFullData: false,
    isStartDateNow: false,
    isFilter: false,
    config: { static: false },
    allowFutureDate: true,
  },
  errors: false,
}

export const getArialLabelOfCalendar = (date: string) => `[aria-label="${moment(date).format('MMMM D, YYYY')}"]`

export const getInput = (wrapper: VueWrapper, testId: string) => {
  const inputWrapper = wrapper.find(getSelectorTestId(testId)).find(getSelectorTestId('flat-picker'))
  if (!inputWrapper.exists())
    throw new Error(`Input with test ID ${testId} not found.`)

  return inputWrapper
}

export const getInputsRange = (wrapper: VueWrapper) => ({
  from: getInput(wrapper, 'from'),
  to: getInput(wrapper, 'to'),
})

export const mountDateField = (propsOverride: Partial<typeof defaultProps> = {}) =>
  mount(DateField, {
    props: { ...defaultProps, ...propsOverride },
    global: { plugins: [router] },
  })

export const getOverwrittenParams = (params: Partial<typeof defaultProps.field>) => ({
  ...defaultProps,
  field: { ...defaultProps.field, ...params },
})

export const checkEmittedValue = (wrapper: VueWrapper, expectedValue: string, emitIndex = 0) => {
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted()['update:modelValue'][emitIndex][0]).toEqual(expectedValue)
}

export const testChangeInputValue = async ({ valueOfSet = '', inputKey, dateRange, indexEmit = 0, isFilter }: OnChangeValueRangeConfig, expectedValue: string) => {
  const props = getOverwrittenParams({ isRangeMode: true, isFilter, config: { static: true } })

  props.modelValue = `${dateRange.from} to ${dateRange.to}`

  const wrapper = mountDateField(props)
  const inputs = getInputsRange(wrapper)

  expect(inputs.from.element.value).toBe(dateRange.from)
  expect(inputs.to.element.value).toBe(dateRange.to)

  await inputs[inputKey].setValue(valueOfSet)
  checkEmittedValue(wrapper, expectedValue, indexEmit)
}

export const testOnCallEventEmmitAndEqualValue = (wrapper: VueWrapper, value: string, emmitIndex = 0) => {
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted()['update:modelValue'][emmitIndex][0]).toEqual(value)
}

export const setAndCheckInputValue = async (input: DOMWrapper<HTMLInputElement>, initialValue: number, increment: number) => {
  input.element.value = (initialValue + increment).toString()
  await input.trigger('input')
  expect(Number.parseInt(input.element.value, 10)).toBe(initialValue + increment)
}

interface OnChangeValueRangeConfig {
  inputKey: 'from' | 'to'
  isFilter: boolean
  dateRange: { from: string; to: string }
  valueOfSet?: string
  indexEmit?: number
}
