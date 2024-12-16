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

describe('BadgesView', () => {
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
  })

  it('Should render label of filters and ', async () => {
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
})
