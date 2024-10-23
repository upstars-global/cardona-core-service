import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import moment from 'moment'
import AppDateTimePicker from '../../../../src/@core/components/app-form-elements/AppDateTimePicker.vue'
import DateFieldComponent from '../../../../src/components/templates/FieldGenerator/_components/DateField.vue'
import { router } from '../../../../src/plugins/1.router'
import { testOn } from '../shared-tests/test-case-generator'

vi.mock('vue-flatpickr-component', () => ({
  __esModule: true,
  default: {
    render() {
      return null
    },
  },
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: { value: 'en' },
  }),
}))

beforeEach(() => {
  const pinia = createPinia()

  setActivePinia(pinia)
})

describe('DateFieldComponent.vue', () => {
  const defaultProps = {
    modelValue: '2023-01-01',
    field: {
      withTime: true,
      isRangeMode: false,
      placeholder: 'Select date',
      label: 'Date Label',
      withInitFullData: false,
      isStartDateNow: true,
      isFilter: false,
      config: {},
      allowFutureDate: false,
    },
    errors: false,
  }

  it('Render correct picker on range mode', () => {
    const wrapper = mount(DateFieldComponent, {
      props: { ...defaultProps, field: { ...defaultProps.field, isFilter: true, isRangeMode: true } },
      global: {
        plugins: [router],
      },
    })

    const pickerDataTestIds = ['from', 'to']

    pickerDataTestIds.forEach((testId: string) => {
      testOn.existElement({ wrapper, testId })
    })

    expect(wrapper.findComponent(AppDateTimePicker).exists()).toBe(true)
  })
  it('emits modelValue with current time when isFilter is true for single date', async () => {
    const wrapper = mount(DateFieldComponent, {
      props: {
        ...defaultProps,
        field: {
          ...defaultProps.field,
          isFilter: true,
        },
      },
      global: {
        plugins: [router],
      },
    })

    const picker = wrapper.findComponent(AppDateTimePicker)

    await picker.vm.$emit('update:modelValue', '2023-12-31')

    const expectedDate = moment(1432252800).format()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()

    /// TODO select correct select for set value of calendar
    // expect(wrapper.emitted('update:modelValue')[0]).toEqual([`${expectedDate} - 2023-12-31`])
  })

  it('Applies current date when clear input in range mode with isFilter enabled', async () => {
    const wrapper = mount(DateFieldComponent, {
      props: {
        ...defaultProps,
        field: {
          ...defaultProps.field,
          isRangeMode: true,
          isFilter: true,
        },
      },
      global: {
        plugins: [router],
      },
    })

    /// TODO fix expected value and set correct value of date

    // expect(wrapper.emitted('update:modelValue')).toBeTruthy()

    // expect(wrapper.emitted('update:modelValue')[0]).toEqual([`${expectedDateFrom} - ${currentDate}`])
  })

  it('updates modelValue when date is selected in single mode', async () => {
    const wrapper = mount(DateFieldComponent, {
      props: defaultProps,
      global: {
        plugins: [router],
      },
    })

    const picker = wrapper.findComponent(AppDateTimePicker)

    await picker.vm.$emit('update:modelValue', '2023-12-31')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2023-12-31'])
  })

  it('Correctly handles date ranges', async () => {
    const rangeProps = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        isRangeMode: true,
        isFilter: false,
      },
    }

    const wrapper = mount(DateFieldComponent, {
      props: rangeProps,
      global: {
        plugins: [router],
      },
    })

    const dateFromPicker = wrapper.findAllComponents(AppDateTimePicker)[0]
    const dateToPicker = wrapper.findAllComponents(AppDateTimePicker)[1]

    await dateFromPicker.vm.$emit('update:modelValue', '2023-01-01')
    await dateToPicker.vm.$emit('update:modelValue', '2023-01-10')

    /// TODO recheck update property and emitted value on this property
    // expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    // expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2023-01-01 to 2023-01-10'])
  })

  it('Applies correct configuration for range mode', async () => {
    const rangeProps = {
      ...defaultProps,
      field: {
        ...defaultProps.field,
        isRangeMode: true,
      },
    }

    const wrapper = mount(DateFieldComponent, {
      props: rangeProps,
      global: {
        plugins: [router],
      },
    })

    /// TODO check in dom element classes or another selector to check range
    const configFrom = wrapper.vm.configFrom
    const configTo = wrapper.vm.configTo

    expect(configFrom.mode).toBe('single')
    expect(configTo.mode).toBe('single')
    expect(configFrom.minDate).toBe(true)
  })

  it('Clears input when no value is selected', async () => {
    const wrapper = mount(DateFieldComponent, {
      props: defaultProps,
      global: {
        plugins: [router],
      },
    })

    const picker = wrapper.findComponent(AppDateTimePicker)

    await picker.vm.$emit('update:modelValue', '')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([''])
  })
})
