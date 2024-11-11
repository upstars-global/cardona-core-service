import { beforeEach, describe, expect, it, vi } from 'vitest'
import vSelect from 'vue-select'
import { nextTick } from 'vue'
import MultiSelectField from '../../../../src/components/templates/FieldGenerator/_components/MultiSelectField.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { SelectBaseField } from '../../../../src/@model/templates/baseField'
import type { OptionsItem } from '../../../../src/@model'
import { testOn } from '../shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'
import { expectedEmitValue } from '../shared-tests/general'

const getMountMultiSelectField = setMountComponent(MultiSelectField)

vi.mock('lodash', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    debounce: (fn: Function) => fn,
    has: actual.has,
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
  modelValue: [],
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

describe('MultiSelectField', () => {
  it('Check placeholder states default and filled ', async () => {
    const installedPlaceholderParam = { placeholder: i18n.t('placeholder.choose.group') }

    const wrapper = getMountMultiSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    /// Default placeholder check
    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, i18n.t('placeholder.choose._'))

    await wrapper.setProps(installedPlaceholderParam)

    /// Installed new placeholder
    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, installedPlaceholderParam.placeholder)
  })

  it('Check loading on fetch ', async () => {
    const wrapper = getMountMultiSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    await wrapper.setProps({ fetchOptions: vi.fn().mockResolvedValue(options) })
  })

  it('Option search options actions', async () => {
    const wrapper = getMountMultiSelectField({
      ...props,
      fetchOptions: async () => options,
    }, {
      components: {
        VueSelect: vSelect,
      },
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
    const wrapper = getMountMultiSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    expect(wrapper.find('.vs__spinner').element.style.display).toBe('none')

    wrapper.vm.isLoading = true
    await nextTick()

    expect(wrapper.find('.vs__spinner').element.style.display).not.toBe('none')
  })

  it('Check immediate fetch on empty options', async () => {
    const wrapper = getMountMultiSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

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
    const wrapper = getMountMultiSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    testOn.checkLengthElements({ wrapper, selector: '.vs__dropdown-option', all: true }, field.options.length)
  })

  it('Select and unselect option item ', async () => {
    props.modelValue = [options[0], options[1]]

    const wrapper = getMountMultiSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    /// Deselect option item
    await clickTrigger({ wrapper, selector: '.vs__deselect' })

    expectedEmitValue(wrapper, [options[1]])
    await wrapper.setProps({ ...props, modelValue: [options[1]] })

    await nextTick()

    /// Check actual selected elements
    testOn.checkLengthElements({ wrapper, selector: '.vs__selected', all: true }, 1)
    testOn.existTextValue({ wrapper, selector: '.vs__selected' }, options[1].name)

    /// Select option item
    await clickTrigger({ wrapper, selector: '.vs__dropdown-option' })

    /// Set emitted value
    await wrapper.setProps({ ...props, modelValue: [options[2]] })

    /// Check actual selected elements
    expectedEmitValue(wrapper, [options[1], options[0]], 1)
  })

  it('Disable state by props', async () => {
    const wrapper = getMountMultiSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    /// Disabled props false
    testOn.notExistClasses({ wrapper, selector: '.vs--multiple' }, 'vs--disabled')

    await wrapper.setProps({ disabled: true })

    /// Disabled props true
    testOn.existClass({ wrapper, selector: '.vs--multiple' }, 'vs--disabled')
  })
})
