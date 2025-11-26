// import { beforeEach, describe, expect, it, vi } from 'vitest'
import { beforeEach, describe, it } from 'vitest'
import { cloneDeep } from 'lodash'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { defaultProps as defaultPropsBaseList, fields } from '../../../mocks/base-list'
import { setMountComponent } from '../../../utils'
import { ListTypes } from '../../../../../src/@model/templates/baseList'

const getMountComponent = setMountComponent(BaseList)

let props = null

const defaultProps = {
  config: defaultPropsBaseList.config,
  useList: () => ({
    ListFilterModel: class PassthroughFilter {
      constructor(data?: any) { Object.assign(this, data) }
    },
    entityName: 'Test',
    fields,
  }),
  type: ListTypes.Default,
}

describe('BaseList', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
  })

  it('Should render the default state with cell slots', async () => {
    const global = {}
    const wrapper = getMountComponent(props, global)

    console.log(wrapper.html(), '1111')
  })
})
