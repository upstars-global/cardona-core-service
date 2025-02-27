import type { VueWrapper } from '@vue/test-utils'
import { describe, it } from 'vitest'
import { nextTick } from 'vue'
import moment from 'moment'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'
import 'flatpickr/dist/flatpickr.css'
import {
  checkEmittedValue,
  getArialLabelOfCalendar,
  mountDateFieldWithDefaultProps, setAndCheckInputValue, testChangeInputValue,
  testOnCallEventEmitAndEqualValue,
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
    const dayOfCalendar = wrapper.find(getArialLabelOfCalendar(datePickerButton))

    await dayOfCalendar.trigger('click')

    testOnCallEventEmitAndEqualValue(wrapper, expectedValue)
  }

  it('Change value on click button month on calendar ', async () => {
    const datePickerButton = '2024-11-10'

    const wrapper = mountDateFieldWithDefaultProps({
      field: { config: { static: true }, isRangeMode: false },
      modelValue: '2024-10-10T11:00:00.000Z',
    })

    const monthOfCalendar = wrapper.find('.flatpickr-next-month')

    await monthOfCalendar.trigger('click')

    await nextTick()

    const dayOfCalendar = wrapper.find(getArialLabelOfCalendar(datePickerButton))

    await dayOfCalendar.trigger('click')

    testOn.isCalledEmitEventValue({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: datePickerButton })
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

    testOn.existElement({ wrapper: input })

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
      `2024-11-12T11:00:00.000Z to ${moment().format().split('T')[0]}`, /// Set only date without time because don't need to check time
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

  it('Should add class errors for invalid field', async () => {
    const wrapper = mountDateFieldWithDefaultProps({
      field: { config: { static: true }, isRangeMode: false },
      modelValue: '',
      errors: true,
    })

    testOn.existClassList({ wrapper, testId: 'single-picker' }, ['v-input--error', 'error'])
  })
})
