import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import DateFieldComponent from '../../../../src/components/templates/FieldGenerator/_components/DateField.vue'
import { router } from '../../../../src/plugins/1.router'
import { testOn } from '../shared-tests/test-case-generator'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment'
import { getSelectorTestId } from '../../utils'

/// .flatpickr-prev-month
/// .flatpickr-next-month
/// .flatpickr-day

// 2024-10-23T17:40:45.000Z to 2024-10-23T17:40:45.000Z
// 2024-10-14

const getArialLabelOfCalendar = (date: string) => `[aria-label="${moment(date).format('MMMM D, YYYY')}"]`

// const clickCurrentCalendar = async (wrapper: VueWrapper, date: string) => {
//   await wrapper.find(getArialLabelOfCalendar(date)).trigger('click')
// }

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
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue']).toEqual([[`${datePickerButton}T11:00:00.000Z`]])
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

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted()['update:modelValue'][0][0]).includes(datePickerButton)
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

  it('On change input value from in filter mode', async () => {
    const props = getOverwritedParams({ isRangeMode: true, isFilter: true, config: { static: true } })
    const propsDateFrom = '2024-11-11T11:00:00.000Z'
    const propsDateTo = '2024-11-12T11:00:00.000Z'

    props.modelValue = `${propsDateFrom} to ${propsDateTo}`

    const wrapper = mount(DateFieldComponent, {
      props,
      global: {
        plugins: [router],
      },
    })

    const inputFrom = wrapper.find(getSelectorTestId('from')).find(getSelectorTestId('flat-picker'))
    const inputTo = wrapper.find(getSelectorTestId('to')).find(getSelectorTestId('flat-picker'))

    expect(inputFrom.element.value).toBe('2024-11-11T11:00:00.000Z')
    expect(inputTo.element.value).toBe('2024-11-12T11:00:00.000Z')

    await inputFrom.setValue('')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')

    expect(wrapper.emitted()['update:modelValue'][0][0]).includes(`${moment(1432252800).format()} to ${propsDateTo}`)
  })

  it('On change input value to in filter mode', async () => {
    const props = getOverwritedParams({ isRangeMode: true, isFilter: true, config: { static: true } })
    const propsDateFrom = '2024-11-11T11:00:00.000Z'
    const propsDateTo = '2024-11-12T11:00:00.000Z'

    props.modelValue = `${propsDateFrom} to ${propsDateTo}`

    const wrapper = mount(DateFieldComponent, {
      props,
      global: {
        plugins: [router],
      },
    })

    const inputFrom = wrapper.find(getSelectorTestId('from')).find(getSelectorTestId('flat-picker'))
    const inputTo = wrapper.find(getSelectorTestId('to')).find(getSelectorTestId('flat-picker'))

    expect(inputFrom.element.value).toBe('2024-11-11T11:00:00.000Z')
    expect(inputTo.element.value).toBe('2024-11-12T11:00:00.000Z')

    await inputTo.setValue('')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')

    expect(wrapper.emitted()['update:modelValue'][1][0]).includes(`${propsDateFrom} to ${moment().format()}`)
  })
})
