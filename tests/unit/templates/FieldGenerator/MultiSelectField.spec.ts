import { beforeEach, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MultiSelectField from '../../../../src/components/templates/FieldGenerator/_components/MultiSelectField.vue'
import { clickTrigger } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'
import { expectedEmitValue } from '../shared-tests/general'
import {
  checkDisabledStateByProps,
  checkImmediateFetchOnEmptyOptions,
  checkLoadingStateInput,
  checkOptionSearchActions, checkOptionsLength,
  checkPlaceholderStatesAndFilter, defaultPropsSelect, field,
  options,
  setMountComponentSelect,
} from '../shared-tests/select-field'

const getMountMultiSelectField = setMountComponentSelect(MultiSelectField)

const defaultProps = {
  ...defaultPropsSelect,
  modelValue: [],
}

let props

beforeEach(() => {
  props = defaultProps
})

vi.mock('lodash', async importOriginal => {
  const actual = await importOriginal()

  return {
    ...actual,
    debounce: (fn: Function) => fn,
    has: actual.has,
  }
})

vi.spyOn(field, 'fetchOptions').mockResolvedValue(options)

describe('MultiSelectField', () => {
  it('Check placeholder states default and filled ', async () => {
    await checkPlaceholderStatesAndFilter(getMountMultiSelectField(props))
  })

  it('Option search options actions', async () => {
    const wrapper = getMountMultiSelectField({
      ...props,
      fetchOptions: async () => options,
    })

    await checkOptionSearchActions(wrapper, { options, field })
  })

  it('Check loading state input', async () => {
    const wrapper = getMountMultiSelectField(props)

    await checkLoadingStateInput(wrapper)
  })

  it('Check immediate fetch on empty options', async () => {
    const wrapper = getMountMultiSelectField(props)

    await checkImmediateFetchOnEmptyOptions(wrapper, { options, field })
  })

  it('Is actual quantity  options', async () => {
    const wrapper = getMountMultiSelectField(props)

    checkOptionsLength(wrapper, field)
  })

  it('Select and unselect option item ', async () => {
    props.modelValue = [options[0], options[1]]

    const wrapper = getMountMultiSelectField(props)

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
    const wrapper = getMountMultiSelectField(props)

    await checkDisabledStateByProps(wrapper, { selector: '.vs--multiple' })
  })
})
