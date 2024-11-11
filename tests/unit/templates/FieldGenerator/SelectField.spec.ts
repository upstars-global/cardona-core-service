import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SelectField from '../../../../src/components/templates/FieldGenerator/_components/SelectField.vue'
import { SelectBaseField } from '../../../../src/@model/templates/baseField'
import type { OptionsItem } from '../../../../src/@model'
import { testOn } from '../shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'
import { setMountComponentSelect } from '../shared-tests/select-field'

const getMountSelectField = setMountComponentSelect(SelectField)

vi.mock('lodash', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    debounce: (fn: Function) => fn, // Замоканная версия debounce
    has: actual.has, // Убедитесь, что has доступен
  }
})

const options: OptionsItem[] = [
  { id: 'USD', name: 'US Dollar' },
  { id: 'EUR', name: 'Euro' },
  { id: 'JPY', name: 'Japanese Yen' },
]

const field = new SelectBaseField({
  key: 'currency',
  label: 'Currency',
  options,
  clearable: true,
  appendToBody: false,

})

const defaultProps = {
  modelValue: 'US Dollar',
  field,
  errors: false,
  disabled: false,
  size: 'medium',
}

let props

vi.spyOn(field, 'fetchOptions').mockResolvedValue(options)

beforeEach(() => {
  props = defaultProps
})

describe('SelectField', () => {
  it('Check placeholder states default and filled ', async () => {
    const installedPlaceholderParam = { placeholder: i18n.t('placeholder.choose.group') }

    const wrapper = getMountSelectField(props)

    /// Default placeholder check
    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, i18n.t('placeholder.choose._'))

    await wrapper.setProps(installedPlaceholderParam)

    /// Installed new placeholder
    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, installedPlaceholderParam.placeholder)
  })

  it('Check loading on fetch ', async () => {
    const wrapper = getMountSelectField(props)

    await wrapper.setProps({ fetchOptions: vi.fn().mockResolvedValue(options) })
  })

  it('Option search options actions', async () => {
    const wrapper = getMountSelectField({
      ...props,
      fetchOptions: async () => options,
    })

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
  })

  it('Check loading state input', async () => {
    const wrapper = getMountSelectField(props)

    expect(wrapper.find('.vs__spinner').element.style.display).toBe('none')

    wrapper.vm.isLoading = true
    await nextTick()

    expect(wrapper.find('.vs__spinner').element.style.display).not.toBe('none')
  })

  it('Check immediate fetch on empty options', async () => {
    const wrapper = getMountSelectField(props)

    expect(wrapper.vm.isLoading).toBe(false)

    await wrapper.setProps({
      field: {
        ...field,
        options: null,
        fetchOptions: async () =>
          new Promise(resolve => setTimeout(() => resolve(options), 100)), // Задержка 1 сек
      },
    })

    await nextTick()
    expect(wrapper.vm.isLoading).toBe(true)

    await new Promise(resolve => setTimeout(resolve, 150))
    await nextTick()
    expect(field.fetchOptions).toHaveBeenCalled()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('Is actual quantity  options', async () => {
    const wrapper = getMountSelectField(props)

    testOn.checkLengthElements({ wrapper, selector: '.vs__dropdown-option', all: true }, field.options.length)
  })

  it('Check exist button clear by props ', async () => {
    props.field.clearable = true

    const wrapper = getMountSelectField(props)

    /// When model value empty
    testOn.includePropertyStyle({ wrapper, selector: '.vs__clear' }, { display: 'none' })

    await wrapper.setProps({ modelValue: options[0] })

    /// When model value filled
    testOn.notIncludePropertyStyle({ wrapper, selector: '.vs__clear' }, { display: 'none' })
  })

  it('Disable state by props', async () => {
    const wrapper = getMountSelectField(props)

    /// Disabled props false
    testOn.notExistClasses({ wrapper, selector: '.select-field' }, 'vs--disabled')

    await wrapper.setProps({ disabled: true })

    /// Disabled props true
    testOn.existClass({ wrapper, selector: '.select-field' }, 'vs--disabled')
  })
})
