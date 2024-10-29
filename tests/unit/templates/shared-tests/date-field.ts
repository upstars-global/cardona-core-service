import moment from 'moment/moment'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { merge } from 'lodash'
import { getSelectorTestId, setMountComponent } from '../../utils'
import { router } from '../../../../src/plugins/1.router'
import DateField from '../../../../src/components/templates/FieldGenerator/_components/DateField.vue'

export const getMountDateField = setMountComponent(DateField)

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

export const getInput = (wrapper: VueWrapper, testId: string) => wrapper.find(getSelectorTestId(testId)).find(getSelectorTestId('flat-picker'))

export const getInputsRange = (wrapper: VueWrapper) => ({
  from: getInput(wrapper, 'from'),
  to: getInput(wrapper, 'to'),
})

export const mountDateFieldWithDefaultProps = (propsOverride: Partial<typeof defaultProps> = {}) =>
  getMountDateField(merge(defaultProps, propsOverride), {},
    {
      plugins: [router],
    })

export const checkEmittedValue = (wrapper: VueWrapper, expectedValue: string, emitIndex = 0) => {
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted()['update:modelValue'][emitIndex][0]).toEqual(expectedValue)
}

export const testChangeInputValue = async ({ valueOfSet = '', inputKey, dateRange, indexEmit = 0, isFilter }: OnChangeValueRangeConfig, expectedValue: string) => {
  const props = merge(defaultProps, { field: { isRangeMode: true, isFilter, config: { static: true } } })

  props.modelValue = `${dateRange.from} to ${dateRange.to}`

  const wrapper = mountDateFieldWithDefaultProps(props)
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
