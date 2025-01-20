import { beforeEach, describe, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MultiSelectField from '../../../../src/components/templates/FieldGenerator/_components/MultiSelectField.vue'
import { clickTrigger } from '../../utils'
import { EventEmittersNames, testOn } from '../shared-tests/test-case-generator'
import {
  checkDisabledStateByProps,
  checkImmediateFetchOnEmptyOptions,
  checkLoadingStateInput,
  checkOptionSearchActions, checkOptionsLength,
  checkPlaceholderStatesAndFilter, defaultPropsSelect, field, openDropDownMenuOfSelector,
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

  it('Call action fetch options on update search input ', async () => {
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

  it('Check valid options length', async () => {
    const wrapper = getMountMultiSelectField(props)

    await checkOptionsLength(wrapper, field)
  })

  it('Select and unselect option item ', async () => {
    props.modelValue = [options[0], options[1]]

    const wrapper = getMountMultiSelectField(props)

    await openDropDownMenuOfSelector(wrapper)

    /// Click for deselect option item
    await clickTrigger({ wrapper, selector: '.vs__deselect' })

    testOn.isCalledEmitEventValueToEqualDeep({ wrapper }, { event: EventEmittersNames.UpdateVModel, value: [options[1]] })

    await wrapper.setProps({ ...props, modelValue: [options[1]] })

    await nextTick()

    /// Test on valid selected options
    testOn.checkLengthElements({ wrapper, selector: '.vs__selected', all: true }, 1)
    testOn.existTextValue({ wrapper, selector: '.vs__selected' }, options[1].name)

    /// Select fist option item
    await clickTrigger({ wrapper, selector: '.vs__dropdown-option' })

    /// Update model value
    await wrapper.setProps({ ...props, modelValue: [options[2]] })

    ///  Test on valid selected options
    testOn.isCalledEmitEventValueToEqualDeep({ wrapper },
      { event: EventEmittersNames.UpdateVModel, value: [options[1], options[0]], index: 1 })
  })

  it('Disable state by props', async () => {
    const wrapper = getMountMultiSelectField(props)

    await checkDisabledStateByProps(wrapper, { selector: '.vs--multiple' })
  })
})
