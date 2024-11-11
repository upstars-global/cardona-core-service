import vSelect from 'vue-select'
import type { Component } from 'vue'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'
import { setMountComponent as setMountComponentGeneral } from '../../utils'
import { i18n } from '../../../../src/plugins/i18n'
import type { OptionsItem } from '../../../../src/@model'
import type SelectField from '../../../../src/components/templates/FieldGenerator/_components/SelectField.vue'
import { SelectBaseField } from '../../../../src/@model/templates/baseField'
import { testOn } from './test-case-generator'

export const options: OptionsItem[] = [
  { id: 'USD', name: 'US Dollar' },
  { id: 'EUR', name: 'Euro' },
  { id: 'JPY', name: 'Japanese Yen' },
]

export const field = new SelectBaseField({
  key: 'currency',
  label: 'Currency',
  options,
  clearable: true,
  appendToBody: false,
})

export const setMountComponentSelect = (component: Component) => (props: unknown) => setMountComponentGeneral(component)(props, {
  components: {
    VueSelect: vSelect,
  },
})

export const defaultPropsSelect = {
  modelValue: null,
  field,
  errors: false,
  disabled: false,
  size: 'medium',
}

export const checkPlaceholderStatesAndFilter = async (wrapper: VueWrapper) => {
  const installedPlaceholderParam = { placeholder: i18n.t('placeholder.choose.group') }

  /// Default placeholder check
  testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, i18n.t('placeholder.choose._'))

  await wrapper.setProps(installedPlaceholderParam)

  /// Installed new placeholder
  testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, installedPlaceholderParam.placeholder)
}

export const checkOptionSearchActions = async (wrapper: VueWrapper, { options, field }: { options: Array<OptionsItem>; field: SelectField }) => {
  const searchQuery = options[0].name

  const input = wrapper.find('input')

  await input.setValue(searchQuery)
  await input.trigger('input')
  await nextTick()

  /// Check call fetch cation
  expect(field.fetchOptions).toHaveBeenCalledWith(searchQuery)

  /// Check filtered of options by search value
  testOn.checkLengthElements({ wrapper, selector: '.vs__dropdown-option', all: true }, 1)
  testOn.equalTextValue({ wrapper, selector: '.vs__dropdown-option' }, searchQuery)
}

export const checkLoadingStateInput = async (wrapper: VueWrapper) => {
  expect(wrapper.find('.vs__spinner').element.style.display).toBe('none')

  wrapper.vm.isLoading = true
  await nextTick()

  expect(wrapper.find('.vs__spinner').element.style.display).not.toBe('none')
}

export const checkImmediateFetchOnEmptyOptions = async (wrapper: VueWrapper, { options, field }: { options: Array<OptionsItem>; field: SelectField }) => {
  expect(wrapper.vm.isLoading).toBe(false)

  await wrapper.setProps({
    field: {
      ...field,
      options: null,
      fetchOptions: async () =>
        new Promise(resolve => setTimeout(() => resolve(options), 100)),
    },
  })

  await nextTick()
  expect(wrapper.vm.isLoading).toBe(true)

  await new Promise(resolve => setTimeout(resolve, 150))
  await nextTick()
  expect(field.fetchOptions).toHaveBeenCalled()
  expect(wrapper.vm.isLoading).toBe(false)
}

export const checkOptionsLength = (wrapper: VueWrapper, field: SelectField) => {
  testOn.checkLengthElements({ wrapper, selector: '.vs__dropdown-option', all: true }, field.options.length)
}

export const checkDisabledStateByProps = async (wrapper: VueWrapper, { selector }: { selector: string }) => {
  const expectedClass = 'vs--disabled'

  /// Disabled props false
  testOn.notExistClasses({ wrapper, selector }, expectedClass)

  await wrapper.setProps({ disabled: true })

  /// Disabled props true
  testOn.existClass({ wrapper, selector }, expectedClass)
}
