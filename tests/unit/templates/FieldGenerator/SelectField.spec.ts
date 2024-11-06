import { beforeEach, describe, expect, it, vi } from 'vitest'
import vSelect from 'vue-select'
import { nextTick } from 'vue'
import SelectField from '../../../../src/components/templates/FieldGenerator/_components/SelectField.vue'
import { setMountComponent } from '../../utils'
import { SelectBaseField } from '../../../../src/@model/templates/baseField'
import type { OptionsItem } from '../../../../src/@model'
import { testOn } from '../shared-tests/test-case-generator'
import { i18n } from '../../../../src/plugins/i18n'

const getMountSelectField = setMountComponent(SelectField)

// Mock the store, debounce, and i18n
// vi.mock('../../../../plugins/i18n', () => ({
//   i18n: { t: (key: string) => key },
// }))
// vi.mock('lodash', () => ({
//   debounce: (fn: Function) => fn,
// }))

// vSelect.props.components.default = () => ({
//   Deselect: {
//     render() {
//       return h('i', {
//         class: 'v-icon notranslate v-theme--light v-icon--size-default ml-25 tabler-x',
//       })
//     },
//   },
// })

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
  label: 'Currency !!!!',
  options,
  clearable: true,
  appendToBody: true,
})

const defaultProps = {
  modelValue: '',
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

    const wrapper = getMountSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    /// Default placeholder check
    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, i18n.t('placeholder.choose._'))

    await wrapper.setProps(installedPlaceholderParam)

    testOn.isEqualPlaceholder({ wrapper, selector: 'input' }, installedPlaceholderParam.placeholder)
  })

  it('Check loading on fetch ', async () => {
    const installedPlaceholderParam = { placeholder: i18n.t('placeholder.choose.group') }

    const wrapper = getMountSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    await wrapper.setProps({ fetchOptions: vi.fn().mockResolvedValue(options) })
  })

  // it('calls fetchOptions when props.field.options is empty', async () => {
  //   expect(field.fetchOptions).toHaveBeenCalledTimes(1)
  //
  //   const wrapper = getMountSelectField(props, {
  //     components: {
  //       VueSelect: vSelect,
  //     },
  //   })
  //
  //   await wrapper.vm.$nextTick()
  //
  //   expect(wrapper.vm.isLoading).toBe(false)
  //   expect(wrapper.vm.options).toEqual([
  //     { id: 'USD', name: 'US Dollar' },
  //     { id: 'EUR', name: 'Euro' },
  //   ])
  // })
  //
  it('Calls fetchOptions in onSearch debounce handler', async () => {
    const wrapper = getMountSelectField({
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

    expect(field.fetchOptions).toHaveBeenCalledWith(searchQuery)
  })

  it('Check loading state input', async () => {
    const wrapper = getMountSelectField(props, {
      components: {
        VueSelect: vSelect,
      },
    })

    expect(wrapper.find('.vs__spinner').element.style.display).toBe('none')

    wrapper.vm.isLoading = true
    await nextTick()

    expect(wrapper.find('.vs__spinner').element.style.display).not.toBe('none')
  })
})
