import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import moment from 'moment'
import DateFieldComponent from '../../../../src/components/templates/FieldGenerator/_components/DateField.vue'
import { router } from '../../../../src/plugins/1.router'
import { testOn } from '../shared-tests/test-case-generator'
import 'flatpickr/dist/flatpickr.css'
import { getSelectorTestId } from '../../utils'

const getArialLabelOfCalendar = (date: string) => `[aria-label="${moment(date).format('MMMM D, YYYY')}"]`
const getInput = (wrapper: VueWrapper, testId: string) => wrapper.find(getSelectorTestId(testId)).find(getSelectorTestId('flat-picker'))
const getInputsRange = (wrapper: VueWrapper) => ({ from: getInput(wrapper, 'from'), to: getInput(wrapper, 'to') })

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'en' },
  }),
}))

beforeEach(() => {
  const pinia = createPinia()

  setActivePinia(pinia)
})

const defaultProps = {
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

const getOverwritedParams = (params: Partial<typeof defaultProps.field>) => ({
  ...defaultProps,
  field: { ...defaultProps.field, ...params },
})

const checkEmittedValue = (wrapper: VueWrapper, expectedValue: string, emitIndex = 0) => {
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted()['update:modelValue'][emitIndex][0]).toEqual(expectedValue)
}

const mountDateFieldComponent = (propsOverride: Partial<typeof defaultProps> = {}) =>
  mount(DateFieldComponent, {
    props: { ...defaultProps, ...propsOverride },
    global: { plugins: [router] },
  })

const testChangeInputValue = async ({ valueOfSet = '', inputKey, dateRange, indexEmit = 0, isFilter }: OnChangeValueRangeConfig, expectedValue: string) => {
  const props = getOverwritedParams({ isRangeMode: true, isFilter, config: { static: true } })

  props.modelValue = `${dateRange.from} to ${dateRange.to}`

  const wrapper = mountDateFieldComponent(props)
  const inputs = getInputsRange(wrapper)

  expect(inputs.from.element.value).toBe(dateRange.from)
  expect(inputs.to.element.value).toBe(dateRange.to)

  await inputs[inputKey].setValue(valueOfSet)
  checkEmittedValue(wrapper, expectedValue, indexEmit)
}

const testOnCallEventEmmitAndEqualValue = (wrapper: VueWrapper, value: string, emmitIndex = 0) => {
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted()['update:modelValue'][emmitIndex][0]).toEqual(value)
}


const setAndCheckInputValue = async (input: DOMWrapper<HTMLInputElement>, initialValue: number, increment: number) => {
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

describe('DateFieldComponent.vue', () => {
  it('renders picker by range flag', async () => {
    const wrapper = mountDateFieldComponent({ field: { ...defaultProps.field, isRangeMode: true } })
    const pickerDataTestIds = ['from', 'to']

    pickerDataTestIds.forEach(testId => testOn.existElement({ wrapper, testId }))

    await wrapper.setProps(defaultProps)
    await nextTick()

    pickerDataTestIds.forEach(testId => testOn.notExistElement({ wrapper, testId }))
    testOn.existElement({ wrapper, testId: 'single-picker' })
  })

  it('emits on date value update', async () => {
    const updatedValue = '2024-11-11T11:00:00.000Z'
    const wrapper = mountDateFieldComponent()

    await wrapper.setValue(updatedValue)
    await nextTick()

    checkEmittedValue(wrapper, updatedValue)
  })

  it('Change value on click button month on calendar ', async () => {
    const updatedValue = '2024-10-10T11:00:00.000Z'

    const datePickerButton = '2024-11-11'
    const props = getOverwritedParams({ config: { static: true } })

    props.modelValue = updatedValue

    const wrapper = mount(DateFieldComponent, {
      props,
      global: {
        plugins: [router],
      },
    })

    const monthOfCalendar = wrapper.find('.flatpickr-next-month')

    await monthOfCalendar.trigger('click')

    await nextTick()

    const dayOfCalendar = wrapper.find(getArialLabelOfCalendar(datePickerButton))

    await dayOfCalendar.trigger('click')

    testOnCallEventEmmitAndEqualValue(wrapper, `${datePickerButton}T12:00:00.000Z`)
  })
  it('Change value on click button day on calendar ', async () => {
    const updatedValue = '2024-11-10T11:00:00.000Z'
    const datePickerButton = '2024-11-11'
    const props = getOverwritedParams({ config: { static: true } })

    props.modelValue = updatedValue

    const wrapper = mount(DateFieldComponent, {
      props,
      global: {
        plugins: [router],
      },
    })

    const dayOfCalendar = wrapper.find(getArialLabelOfCalendar(datePickerButton))

    await dayOfCalendar.trigger('click')

    await nextTick()

    testOnCallEventEmmitAndEqualValue(wrapper, `${datePickerButton}T11:00:00.000Z`)
  })

  it('Change value on change input oh hours ', async () => {
    const updatedValue = '2024-10-10T11:00:00.000Z'

    const props = getOverwritedParams({ config: { static: true } })

    props.modelValue = updatedValue

    const wrapper = mount(DateFieldComponent, {
      props,
      global: {
        plugins: [router],
      },
    })

    const hourInput = wrapper.find('input.flatpickr-hour')
    const minuteInput = wrapper.find('input.flatpickr-minute')

    expect(hourInput.exists()).toBe(true)
    expect(minuteInput.exists()).toBe(true)

    const initialHour = Number.parseInt(hourInput.element.value, 10)
    const initialMinute = Number.parseInt(minuteInput.element.value, 10)

    await setAndCheckInputValue(hourInput, initialHour, 1)
    await setAndCheckInputValue(minuteInput, initialMinute, 1)
  })

  it('updates in filter mode with empty from value', async () => {
    await testChangeInputValue(
      {
        inputKey: 'from',
        isFilter: true,
        dateRange: { from: '', to: '' },
        valueOfSet: '2024-11-12T11:00:00.000Z',
      },
      `2024-11-12T11:00:00.000Z to ${moment().format()}`,
    )
  })

  it('updates in filter mode with filled from value', async () => {
    await testChangeInputValue(
      {
        inputKey: 'from',
        isFilter: true,
        dateRange: { from: '2024-11-11T11:00:00.000Z', to: '2024-11-12T11:00:00.000Z' },
      },
      `${moment(1432252800).format()} to 2024-11-12T11:00:00.000Z`,
    )
  })

  it('updates in non-filter mode with empty to value', async () => {
    await testChangeInputValue(
      {
        inputKey: 'to',
        isFilter: false,
        dateRange: { from: '', to: '' },
        valueOfSet: '2024-11-12T11:00:00.000Z',
      },
      ' to 2024-11-12T11:00:00.000Z',
    )
  })
})
