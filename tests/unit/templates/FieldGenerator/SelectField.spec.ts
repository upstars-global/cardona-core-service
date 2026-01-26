import { beforeEach, describe, it, vi } from 'vitest'
import SelectField from '../../../../src/components/templates/FieldGenerator/_components/SelectField.vue'
import { testOn } from '../shared-tests/test-case-generator'
import {
  checkDisabledStateByProps,
  checkImmediateFetchOnEmptyOptions,
  checkLoadingStateInput,
  checkOptionSearchActions, checkOptionsLength,
  checkPlaceholderStatesAndFilter, checkPreloadOptionsByIds, defaultPropsSelect, field,
  options,
  setMountComponentSelect,
} from '../shared-tests/select-field'

const getMountSelectField = setMountComponentSelect(SelectField)

vi.mock('lodash', async importOriginal => {
  const actual = await importOriginal()

  return {
    debounce: (fn: Function) => fn,
    has: actual.has,
    cloneDeep: val => val,
    isFunction: val => val,
  }
})

const defaultProps = {
  ...defaultPropsSelect,
  modelValue: '',
}

let props

vi.spyOn(field, 'fetchOptions').mockResolvedValue(options)

beforeEach(() => {
  props = defaultProps
})

describe('SelectField', () => {
  it('Check placeholder states default and filled ', async () => {
    await checkPlaceholderStatesAndFilter(getMountSelectField(props))
  })

  it('Call action fetch options on update search input', async () => {
    const wrapper = getMountSelectField({
      ...props,
      fetchOptions: async () => options,
    })

    await checkOptionSearchActions(wrapper, { options, field })
  })

  it('Check loading state input', async () => {
    const wrapper = getMountSelectField(props)

    await checkLoadingStateInput(wrapper)
  })

  it('Check immediate fetch on empty options', async () => {
    const wrapper = getMountSelectField(props)

    await checkImmediateFetchOnEmptyOptions(wrapper, { options, field })
  })

  it('Check valid options length', async () => {
    const wrapper = getMountSelectField(props)

    checkOptionsLength(wrapper, field)
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

    await checkDisabledStateByProps(wrapper, { selector: '.select-field' })
  })

  it('Fetch options (preload values) with correct filter.ids when value is an object', async () => {
    const wrapper = getMountSelectField(props)

    await checkPreloadOptionsByIds(wrapper, {
      value: { id: '1', name: 'Option 1' },
      field: {
        ...props.field,
        preloadOptionsByIds: true,
      },
      expectedIds: ['1'],
    })
  })
})
