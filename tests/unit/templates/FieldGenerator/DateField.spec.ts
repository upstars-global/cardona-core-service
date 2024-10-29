import type { VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import moment from 'moment'
import { testOn } from '../shared-tests/test-case-generator'
import 'flatpickr/dist/flatpickr.css'
import {
  checkEmittedValue,
  getArialLabelOfCalendar,
  mountDateFieldWithDefaultProps, setAndCheckInputValue, testChangeInputValue,
  testOnCallEventEmmitAndEqualValue,
} from '../shared-tests/date-field'

describe('DateField.vue', () => {
  it('Render multiple inputs on range mode', async () => {
    const wrapper = mountDateFieldWithDefaultProps({ field: { isRangeMode: true } })
    const pickerDataTestIds = ['from', 'to']

    pickerDataTestIds.forEach(testId => testOn.existElement({ wrapper, testId }))
  })

  it('Render one input on default single mode', async () => {
    const wrapper = mountDateFieldWithDefaultProps({ field: { isRangeMode: false } })

    testOn.existElement({ wrapper, testId: 'single-picker' })
  })

  it('Emits on date value update', async () => {
    const updatedValue = '2024-11-11T11:00:00.000Z'

    const wrapper = mountDateFieldWithDefaultProps()

    await wrapper.setValue(updatedValue)
    await nextTick()

    checkEmittedValue(wrapper, updatedValue)
  })

  const testOnCheckClickableAndValidDayOfPicker = async (
    { wrapper, datePickerButton }: { wrapper: VueWrapper; datePickerButton: string },
    expectedValue: string,
    actionBeforeCheckValue?: CallableFunction,
  ) => {
    actionBeforeCheckValue && await actionBeforeCheckValue()

    const dayOfCalendar = wrapper.find(getArialLabelOfCalendar(datePickerButton))

    await dayOfCalendar.trigger('click')

    testOnCallEventEmmitAndEqualValue(wrapper, expectedValue)
  }

  it('Change value on click button month on calendar ', async () => {
    const datePickerButton = '2024-11-11'

    const wrapper = mountDateFieldWithDefaultProps({
      field: { config: { static: true }, isRangeMode: false },
      modelValue: '2024-10-10T11:00:00.000Z',
    })

    await testOnCheckClickableAndValidDayOfPicker(
      {
        wrapper, datePickerButton,
      }, `${datePickerButton}T12:00:00.000Z`,
      async () => {
        const monthOfCalendar = wrapper.find('.flatpickr-next-month')

        await monthOfCalendar.trigger('click')

        await nextTick()
      },
    )
  })

  it('Change value on click button day on calendar ', async () => {
    const datePickerButton = '2024-11-11'

    const wrapper = mountDateFieldWithDefaultProps({
      field: { config: { static: true }, isRangeMode: false },
      modelValue: '2024-11-10T11:00:00.000Z',
    })

    await testOnCheckClickableAndValidDayOfPicker(
      {
        wrapper, datePickerButton,
      }, `${datePickerButton}T11:00:00.000Z`,
    )
  })

  const onCheckInputValue = async (wrapper: VueWrapper, selector: string) => {
    const input = wrapper.find(selector)

    expect(input.exists()).toBe(true)

    const initialHour = Number.parseInt(input.element.value, 10)

    await setAndCheckInputValue(input, initialHour, 1)
  }

  it('Change value on change input oh hours ', async () => {
    const wrapper = mountDateFieldWithDefaultProps({ field: { config: { static: true } }, modelValue: '2024-10-10T11:00:00.000Z' })

    const selectors = ['input.flatpickr-hour', 'input.flatpickr-minute']

    for (const selector of selectors)
      await onCheckInputValue(wrapper, selector)
  })

  it('Updates in filter mode with empty from value', async () => {
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

  it('Updates in filter mode with filled from value', async () => {
    await testChangeInputValue(
      {
        inputKey: 'from',
        isFilter: true,
        dateRange: { from: '2024-11-11T11:00:00.000Z', to: '2024-11-12T11:00:00.000Z' },
      },
      `${moment(1432252800).format()} to 2024-11-12T11:00:00.000Z`,
    )
  })

  it('Updates in non-filter mode with empty to value', async () => {
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
