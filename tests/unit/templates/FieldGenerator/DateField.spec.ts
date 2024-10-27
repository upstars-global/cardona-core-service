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
    config: {
      static: false,
    },
    allowFutureDate: true,
  },
  errors: false,
}

const getOverwritedParams = params => ({
  ...defaultProps, field: { ...defaultProps.field, ...params },
})

const testOnCallEventEmmitAndEqualValue = (wrapper: VueWrapper, value: string, emmitIndex = 0) => {
  expect(wrapper.emitted()).toHaveProperty('update:modelValue')
  expect(wrapper.emitted()['update:modelValue'][emmitIndex][0]).toEqual(value)
}

const getInput = (wrapper: VueWrapper, testId: string) => wrapper
  .find(getSelectorTestId(testId))
  .find(getSelectorTestId('flat-picker'))

const getInputsRange = (wrapper: VueWrapper) => ({
  from: getInput(wrapper, 'from'),
  to: getInput(wrapper, 'to'),
})

interface OnChangeValueRangeConfig {
  inputKey: 'from' | 'to'
  isFilter: boolean
  dateRange: { from: string; to: string }
  valueOfSet?: string
  indexEmit?: number
}

const testOnChangeInputValue = async ({ valueOfSet = '', inputKey, dateRange, indexEmit = 0, isFilter }: OnChangeValueRangeConfig, expectedValue: string) => {
  const props = getOverwritedParams({ isRangeMode: true, isFilter, config: { static: true } })

  props.modelValue = `${dateRange.from} to ${dateRange.to}`

  const wrapper = mount(DateFieldComponent, {
    props,
    global: {
      plugins: [router],
    },
  })

  const inputs = getInputsRange(wrapper)

  expect(inputs.from.element.value).toBe(dateRange.from)
  expect(inputs.to.element.value).toBe(dateRange.to)

  await inputs[inputKey].setValue(valueOfSet)

  testOnCallEventEmmitAndEqualValue(wrapper, expectedValue, indexEmit)
}

describe('DateFieldComponent.vue', () => {
  it('Render picker by range flag', async () => {
    const wrapper = mount(DateFieldComponent, {
      props: { ...defaultProps, field: { ...defaultProps.field, isRangeMode: true } },
      global: {
        plugins: [router],
      },
    })

    const pickerDataTestIds = ['from', 'to']

    pickerDataTestIds.forEach((testId: string) => {
      testOn.existElement({ wrapper, testId })
    })

    await wrapper.setProps(defaultProps)

    await nextTick()

    pickerDataTestIds.forEach((testId: string) => {
      testOn.notExistElement({ wrapper, testId })
    })

    testOn.existElement({ wrapper, testId: 'single-picker' })
  })

  it('On call emit on update date value ', async () => {
    const updatedValue = '2024-11-11T11:00:00.000Z'

    const wrapper = mount(DateFieldComponent, {
      props: defaultProps,
      global: {
        plugins: [router],
      },
    })

    await wrapper.setValue(updatedValue)

    await nextTick()

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue']).toEqual([[updatedValue]])
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

  it('Change value on change input oh hours ', async () => {
    const updatedValue = '2024-10-10T11:00:00.000Z'

    const props2 = getOverwritedParams({ config: { static: true } })

    props2.modelValue = updatedValue

    const wrapper = mount(DateFieldComponent, {
      props: props2,
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

    hourInput.element.value = (initialHour + 1).toString()
    await hourInput.trigger('input')

    expect(Number.parseInt(hourInput.element.value, 10)).toBe(initialHour + 1)

    minuteInput.element.value = (initialMinute + 1).toString()
    await minuteInput.trigger('input')

    expect(Number.parseInt(minuteInput.element.value, 10)).toBe(initialMinute + 1)
  })

  it('Filter mode on change input value From with filled value', async () => {
    const config: OnChangeValueRangeConfig = {
      inputKey: 'from',
      isFilter: true,
      dateRange: {
        from: '2024-11-11T11:00:00.000Z',
        to: '2024-11-12T11:00:00.000Z',
      },
    }

    await testOnChangeInputValue(config, `${moment(1432252800).format()} to ${config.dateRange.to}`)
  })

  it('Filter mode on change input value To with filled value', async () => {
    const config: OnChangeValueRangeConfig = {
      inputKey: 'to',
      isFilter: true,
      dateRange: {
        from: '2024-11-11T11:00:00.000Z',
        to: '2024-11-12T11:00:00.000Z',
      },
      indexEmit: 1,
    }

    await testOnChangeInputValue(config, `${config.dateRange.from} to ${moment().format()}`)
  })

  it('Filter mode on change input value From with initial empty value', async () => {
    const config: OnChangeValueRangeConfig = {
      inputKey: 'from',
      isFilter: true,
      valueOfSet: '2024-11-12T11:00:00.000Z',
      dateRange: {
        from: '',
        to: '',
      },
    }

    await testOnChangeInputValue(config, `2024-11-12T11:00:00.000Z to ${moment().format()}`)
  })

  it('Filter mode on change input value To with initial empty value', async () => {
    const config: OnChangeValueRangeConfig = {
      inputKey: 'to',
      isFilter: true,
      valueOfSet: '2024-11-12T11:00:00.000Z',
      dateRange: {
        from: '',
        to: '',
      },
    }

    await testOnChangeInputValue(config, '1970-01-17T16:50:52+03:00 to 2024-11-12T11:00:00.000Z')
  })

  it('Filter mode on change input value To with initial empty value', async () => {
    const config: OnChangeValueRangeConfig = {
      inputKey: 'to',
      isFilter: false,
      valueOfSet: '2024-11-12T11:00:00.000Z',
      dateRange: {
        from: '',
        to: '',
      },
    }

    await testOnChangeInputValue(config, ' to 2024-11-12T11:00:00.000Z')
  })
  it('Filter mode on change input value To with initial empty value', async () => {
    const config: OnChangeValueRangeConfig = {
      inputKey: 'from',
      isFilter: false,
      valueOfSet: '2024-11-12T11:00:00.000Z',
      dateRange: {
        from: '',
        to: '',
      },
    }

    await testOnChangeInputValue(config, '2024-11-12T11:00:00.000Z to ')
  })
})
