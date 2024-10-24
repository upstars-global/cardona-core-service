import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import DateFieldComponent from '../../../../src/components/templates/FieldGenerator/_components/DateField.vue'
import { router } from '../../../../src/plugins/1.router'
import { testOn } from '../shared-tests/test-case-generator'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment'

/// .flatpickr-prev-month
/// .flatpickr-next-month
/// .flatpickr-day

// 2024-10-23T17:40:45.000Z to 2024-10-23T17:40:45.000Z
// 2024-10-14

const getArialLabelOfCalendar = (date: string) => `[aria-label="${moment(date).format('MMMM D, YYYY')}"]`

const clickCurrentCalendar = async (wrapper: VueWrapper, date: string) => {
  await wrapper.find(getArialLabelOfCalendar(date)).trigger('click')
}

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
  modelValue: '2023-01-01',
  field: {
    withTime: true,
    isRangeMode: false,
    placeholder: 'Select date',
    label: 'Date Label',
    withInitFullData: false,
    isStartDateNow: true,
    isFilter: false,
    config: {
      static: false,
    },
    allowFutureDate: false,
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
  it('Check open calendar', async () => {
    const wrapper = mount(DateFieldComponent, {
      props: getOverwritedParams({ config: { static: true } }),
      global: {
        plugins: [router],
      },
    })

    // const input = wrapper.find('.form-control.input')

    await nextTick()
    // await wrapper.find('.flatpickr-next-month').trigger('click')
    console.log(wrapper.find(getArialLabelOfCalendar('2024-10-24')).html())
  })
})
