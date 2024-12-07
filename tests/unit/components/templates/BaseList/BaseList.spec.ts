import { beforeEach, describe, it } from 'vitest'
import { cloneDeep } from 'lodash'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { setMountComponent } from '../../../utils'

const getMountBaseList = setMountComponent(BaseList)

const defaultProps = {}

const global = {}

let props

describe('BaseList', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Render default state of component with slots of cell', async () => {
    const wrapper = getMountBaseList({ props, global })

    console.log(wrapper.html())
  })
})
