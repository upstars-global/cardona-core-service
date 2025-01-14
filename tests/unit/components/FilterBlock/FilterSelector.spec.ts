import { beforeEach, describe, it } from 'vitest'

import { cloneDeep } from 'lodash'
import FilterSelector from '../../../../src/components/FiltersBlock/_components/FilterSelector.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { TextBaseField } from '../../../../src/@model/templates/baseField'

const getMountFilterSelector = setMountComponent(FilterSelector)

const filters = [
  new TextBaseField({
    key: 'name',
    label: 'Name',
    placeholder: 'Name',
    value: 'Some name',
  }),
]

const defaultProps = {
  filters: [],
  size: VSizes.Medium,
}

let props

describe('FilterSelector', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Should render component with empty filters and size Md', async () => {
    const wrapper = getMountFilterSelector(props)

    const classesWhichShouldBe = ['v-btn--disabled', 'v-btn--size-default']

    await clickTrigger({ wrapper, testId: 'btn-filter-select' })

    classesWhichShouldBe.forEach(className => {
      testOn.existClass({ wrapper, testId: 'btn-filter-select' }, className)
    })

    testOn.notExistElement({ wrapper, testId: 'filter-selector' })

    /// Check that linkClass hasn`t any custom classes
    testOn.isEqual({ wrapper: wrapper.vm.linkClass }, { 'px-1 py-50 font-small-3': false })
  })

  it('Should render label of filters ', async () => {
    props.filters = filters

    const wrapper = getMountFilterSelector(props)

    /// Check that button isn`t disabled
    testOn.notExistClasses({ wrapper, testId: 'btn-filter-select' }, 'v-btn--disabled')

    await clickTrigger({ wrapper, testId: 'btn-filter-select' })

    /// Check that filter item is rendered
    testOn.existElement({ wrapper, testId: 'filter-item' })

    /// Check that filter item has correct text
    testOn.existTextValue({ wrapper, testId: 'filter-item' }, filters[0].label)
  })

  it('Should call event "selected-filters-changed" with value', async () => {
    props.filters = filters

    const wrapper = getMountFilterSelector(props)

    /// Open filter selector
    await clickTrigger({ wrapper, testId: 'btn-filter-select' })

    /// Simulate click on filter item
    await clickTrigger({ wrapper, testId: 'filter-item' })

    /// Check that event is called with correct value
    testOn.isCalledEmitEventValue(wrapper, { event: 'selected-filters-changed', value: filters[0] })
  })

  it('Should call event "selected-filters-changed" with value', async () => {
    props.filters = filters
    props.size = VSizes.Small

    const wrapper = getMountFilterSelector(props)

    testOn.existClass({ wrapper, testId: 'btn-filter-select' }, 'v-btn--size-small')

    /// Open filter selector
    await clickTrigger({ wrapper, testId: 'btn-filter-select' })

    /// Check that will be correct property class-link of filter item
    testOn.isEqual({ wrapper: wrapper.vm.linkClass }, { 'px-1 py-50 font-small-3': true })
  })
})
