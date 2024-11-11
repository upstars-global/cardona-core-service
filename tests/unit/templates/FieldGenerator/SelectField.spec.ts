import { beforeEach, describe, it, vi } from 'vitest'
import SelectField from '../../../../src/components/templates/FieldGenerator/_components/SelectField.vue'
import { testOn } from '../shared-tests/test-case-generator'
import {
  checkDisabledStateByProps,
  checkImmediateFetchOnEmptyOptions,
  checkLoadingStateInput,
  checkOptionSearchActions, checkOptionsLength,
  checkPlaceholderStatesAndFilter, defaultPropsSelect, field,
  options,
  setMountComponentSelect,
} from '../shared-tests/select-field'

const getMountSelectField = setMountComponentSelect(SelectField)

vi.mock('lodash', async importOriginal => {
  const actual = await importOriginal()

  return {
    debounce: (fn: Function) => fn,
    has: actual.has,
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

  it('Option search actions', async () => {
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

  it('Is actual quantity  options', async () => {
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
})
