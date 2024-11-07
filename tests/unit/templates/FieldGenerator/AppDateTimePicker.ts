import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FlatPickr from 'vue-flatpickr-component'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import AppDateTimePicker from '../../../../src/@core/components/app-form-elements/AppDateTimePicker.vue'

// Мокаем Flatpickr и Vuetify тему
vi.mock('vue-flatpickr-component', () => ({
  __esModule: true,
  default: {
    render() {
      return null
    },
  },
}))

vi.mock('vuetify', () => ({
  useTheme: () => ({
    themes: { value: { dark: true } },
    global: { name: { value: 'dark' } },
  }),
}))

// Инициализация Pinia перед каждым тестом
beforeEach(() => {
  const pinia = createPinia()

  setActivePinia(pinia)
})

describe('AppDateTimePicker', () => {
  it('renders FlatPickr input component', () => {
    const wrapper = mount(AppDateTimePicker, {
      props: {
        modelValue: '2023-01-01',
        config: {},
        placeholder: 'Select date',
      },
    })

    expect(wrapper.findComponent(FlatPickr).exists()).toBe(true)
  })

  it('emits update:modelValue when date is selected', async () => {
    const wrapper = mount(AppDateTimePicker, {
      props: {
        modelValue: '2023-01-01',
        config: {},
      },
    })

    const flatpickrComponent = wrapper.findComponent(FlatPickr)

    // Симулируем изменение значения в FlatPickr
    await flatpickrComponent.vm.$emit('update:modelValue', '2023-12-31')

    // Проверяем, что событие обновления модельного значения было вызвано
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['2023-12-31'])
  })

  it('opens and closes calendar on open and close events', async () => {
    const wrapper = mount(AppDateTimePicker, {
      props: {
        modelValue: '2023-01-01',
        config: {},
      },
    })

    await nextTick()

    const flatpickrComponent = wrapper.findComponent(FlatPickr)

    await flatpickrComponent.vm.$emit('on-open')
    await nextTick()
    expect(wrapper.vm.isCalendarOpen).toBe(true)

    await nextTick()

    await flatpickrComponent.vm.$emit('on-close')
    await nextTick()

    expect(wrapper.vm.isCalendarOpen).toBe(false)
  })

  // it('applies correct theme classes to the calendar', async () => {
  //   const wrapper = mount(AppDateTimePicker, {
  //     props: {
  //       modelValue: '2023-01-01',
  //       config: {},
  //     },
  //   })
  //
  //   wrapper.vm.refFlatPicker = { fp: { calendarContainer: document.createElement('div') } }
  //   await wrapper.vm.$nextTick()
  //
  //   wrapper.vm.updateThemeClassInCalendar()
  //   expect(wrapper.vm.refFlatPicker.fp.calendarContainer.classList).toContain('v-theme--dark')
  // })

  // it('clears input value when clear button is clicked', async () => {
  //   const wrapper = mount(AppDateTimePicker, {
  //     props: {
  //       modelValue: '2023-01-01',
  //     },
  //   })
  //
  //   const clearButton = wrapper.find('[data-test-id="clear-button"]')
  //
  //   await clearButton.trigger('click')
  //
  //   expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  //   expect(wrapper.emitted('update:modelValue')[0]).toEqual([''])
  // })
})
