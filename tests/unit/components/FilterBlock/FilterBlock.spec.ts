import { beforeEach, describe, it } from 'vitest'

import { cloneDeep } from 'lodash'
import FiltersBlock from '../../../../src/components/FiltersBlock/index.vue'
import { setMountComponent } from '../../utils'
import { VSizes } from '../../../../src/@model/vuetify'
import { TextBaseField } from '../../../../src/@model/templates/baseField'

const getMountFiltersBlock = setMountComponent(FiltersBlock)

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

describe('FilterBlock', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Should render component with empty filters and size Md', async () => {
    const wrapper = getMountFiltersBlock(props)

    console.log(wrapper.html())
  })
})
