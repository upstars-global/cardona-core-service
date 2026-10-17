import type { VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import moment from 'moment'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'
import 'flatpickr/dist/flatpickr.css'
import {
  checkEmittedValue,
  getArialLabelOfCalendar,
  getInput,
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

  it('Renders weekdays from Monday to Sunday', () => {
    const wrapper = mountDateFieldWithDefaultProps({
      field: { config: { static: true }, isRangeMode: false },
    })

    const weekdays = wrapper.findAll('.flatpickr-weekday').map(day => day.text())

    expect(weekdays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
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
        valueOfSet: '2025-01-01T10:00:00.000Z',
        isFilter: true,
        dateRange: { from: '2024-11-11T11:00:00.000Z', to: '2024-11-12T11:00:00.000Z' },
      },
      '2025-01-01T10:00:00.000Z to 2024-11-12T11:00:00.000Z',
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

  describe('isStartDateNow', () => {
    const DISABLED_CLASS = 'flatpickr-disabled'
    const HOUR_SELECTOR = 'input.flatpickr-hour'
    const MINUTE_SELECTOR = 'input.flatpickr-minute'
    const RANGE_SEPARATOR = ' to '

    const now = new Date()
    const savedHours = 9
    const savedMinutes = 37

    const getIso = (date: moment.Moment) => date.toISOString()
    const getPastMoment = () => moment(now).subtract(40, 'day').hours(savedHours).minutes(savedMinutes).seconds(0).milliseconds(0)
    const getFutureMoment = () => moment(now).add(5, 'day')

    const getFieldProps = (overrides = {}) => ({
      config: { static: true },
      isRangeMode: false,
      isStartDateNow: true,
      withTime: true,
      ...overrides,
    })

    const mountSingle = (modelValue: string, fieldOverrides = {}) =>
      mountDateFieldWithDefaultProps({ field: getFieldProps(fieldOverrides), modelValue })

    const mountRange = (modelValue: string, fieldOverrides = {}) =>
      mountDateFieldWithDefaultProps({ field: getFieldProps({ isRangeMode: true, ...fieldOverrides }), modelValue })

    const getDaySelector = (date: moment.MomentInput, pickerTestId?: string) => {
      const daySelector = getArialLabelOfCalendar(moment(date).format('YYYY-MM-DD'))

      return pickerTestId ? `[data-test-id="${pickerTestId}"] ${daySelector}` : daySelector
    }

    const expectDayDisabled = (wrapper: VueWrapper, date: moment.MomentInput, pickerTestId?: string) =>
      testOn.existClass({ wrapper, selector: getDaySelector(date, pickerTestId) }, DISABLED_CLASS)

    const expectDayEnabled = (wrapper: VueWrapper, date: moment.MomentInput, pickerTestId?: string) =>
      testOn.notExistClasses({ wrapper, selector: getDaySelector(date, pickerTestId) }, DISABLED_CLASS)

    const tryChangeTime = async (wrapper: VueWrapper, scope = '') => {
      const hourInput = wrapper.find(`${scope} ${HOUR_SELECTOR}`.trim())

      const minuteInput = wrapper.find(`${scope} ${MINUTE_SELECTOR}`.trim())

      ;(hourInput.element as HTMLInputElement).value = '15'
      await hourInput.trigger('input')
      await hourInput.trigger('blur')
      ;(minuteInput.element as HTMLInputElement).value = '45'
      await minuteInput.trigger('input')
      await minuteInput.trigger('blur')

      return {
        hours: (hourInput.element as HTMLInputElement).value,
        minutes: (minuteInput.element as HTMLInputElement).value,
      }
    }

    const expectTimeLocked = async (wrapper: VueWrapper, scope = '') => {
      const time = await tryChangeTime(wrapper, scope)

      expect(time).toEqual({
        hours: String(savedHours).padStart(2, '0'),
        minutes: String(savedMinutes).padStart(2, '0'),
      })
    }

    const expectTimeEditable = async (wrapper: VueWrapper, scope = '') => {
      const time = await tryChangeTime(wrapper, scope)

      expect(time).toEqual({ hours: '15', minutes: '45' })
    }

    describe('single mode', () => {
      it('Keeps a saved past date visible', () => {
        const wrapper = mountSingle(getIso(getPastMoment()))

        testOn.inputAttributeValueToBe(
          { wrapper, selector: 'input.form-control[type="text"]' },
          getPastMoment().format('DD.MM.YYYY, HH:mm'),
        )
      })

      it('Disables other past days but keeps the saved day enabled', () => {
        const savedDate = getPastMoment()
        const wrapper = mountSingle(getIso(savedDate))

        expectDayEnabled(wrapper, savedDate)
        expectDayDisabled(wrapper, moment(savedDate).subtract(2, 'day'))
        expectDayDisabled(wrapper, moment(savedDate).add(2, 'day'))
      })

      it('Disables past days when there is no value', () => {
        const wrapper = mountSingle('')

        expectDayDisabled(wrapper, moment(now).subtract(1, 'day'))
        expectDayEnabled(wrapper, moment(now).add(1, 'day'))
      })

      it('Restores the start-of-today limit once a future date is set', async () => {
        const savedDate = getPastMoment()
        const wrapper = mountSingle(getIso(savedDate))

        expectDayEnabled(wrapper, savedDate)

        await wrapper.setProps({ modelValue: getIso(getFutureMoment()) })
        await nextTick()

        expectDayDisabled(wrapper, moment(now).subtract(1, 'day'))
        expectDayEnabled(wrapper, moment(now))
        expectDayEnabled(wrapper, moment(now).add(1, 'day'))
      })

      it('Does not restrict past days without the flag', () => {
        const savedDate = getPastMoment()
        const wrapper = mountSingle(getIso(savedDate), { isStartDateNow: false })

        expectDayEnabled(wrapper, savedDate)
        expectDayEnabled(wrapper, moment(savedDate).subtract(2, 'day'))
        expectDayEnabled(wrapper, moment(savedDate).add(2, 'day'))
      })

      it('Locks the time of a saved past date', async () => {
        const wrapper = mountSingle(getIso(getPastMoment()))

        await expectTimeLocked(wrapper)
      })

      it('Does not lock the time without a value', async () => {
        const wrapper = mountSingle('')

        await expectTimeEditable(wrapper)
      })

      it('Does not lock the time for a future date', async () => {
        const wrapper = mountSingle(getIso(getFutureMoment()))

        await expectTimeEditable(wrapper)
      })

      it('Unlocks the time once a future date is set', async () => {
        const wrapper = mountSingle(getIso(getPastMoment()))

        await wrapper.setProps({ modelValue: getIso(getFutureMoment()) })
        await nextTick()

        await expectTimeEditable(wrapper)
      })

      it('Does not lock the time of a saved past date without the flag', async () => {
        const wrapper = mountSingle(getIso(getPastMoment()), { isStartDateNow: false })

        await expectTimeEditable(wrapper)
      })
    })

    describe('range mode (from picker)', () => {
      const getRangeValue = () => `${getIso(getPastMoment())}${RANGE_SEPARATOR}${getIso(getFutureMoment())}`

      it('Keeps the saved past start date visible', () => {
        const wrapper = mountRange(getRangeValue())
        const fromInput = getInput(wrapper, 'from')

        expect(fromInput.element.value).not.toBe('')
        expect(moment(fromInput.element.value).isSame(getPastMoment(), 'minute')).toBe(true)
      })

      it('Disables other past days but keeps the saved start day enabled', () => {
        const savedDate = getPastMoment()
        const wrapper = mountRange(getRangeValue())

        expectDayEnabled(wrapper, savedDate, 'from')
        expectDayDisabled(wrapper, moment(savedDate).subtract(2, 'day'), 'from')
        expectDayDisabled(wrapper, moment(savedDate).add(2, 'day'), 'from')
      })

      it('Locks the time of the saved past start date', async () => {
        const wrapper = mountRange(getRangeValue())

        await expectTimeLocked(wrapper, '[data-test-id="from"]')
      })

      it('Does not restrict the start date without the flag', () => {
        const savedDate = getPastMoment()
        const wrapper = mountRange(getRangeValue(), { isStartDateNow: false })

        expectDayEnabled(wrapper, moment(savedDate).subtract(2, 'day'), 'from')
        expectDayEnabled(wrapper, moment(savedDate).add(2, 'day'), 'from')
      })
    })
  })
})
