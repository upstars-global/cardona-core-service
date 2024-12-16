import { beforeEach, describe, it } from 'vitest'

import { cloneDeep } from 'lodash'
import FilterSelector from '../../../../src/components/FiltersBlock/_components/FilterSelector.vue'
import { setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { testOn } from '../../templates/shared-tests/test-case-generator'

const getMountFilterSelector = setMountComponent(FilterSelector)

const defaultProps = {
  filters: [],
  size: VSizes.Medium,
}

let props

describe('BadgesView', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Should render component with empty filters and size Md', () => {
    const wrapper = getMountFilterSelector(props)

    const classesWhichShouldBe = ['v-btn--disabled', 'v-btn--size-default']

    classesWhichShouldBe.forEach(className => {
      testOn.existClass({ wrapper, testId: 'btn-filter-select' }, className)
    })

    testOn.notExistElement({ wrapper, testId: 'filter-selector' })
  })
})
