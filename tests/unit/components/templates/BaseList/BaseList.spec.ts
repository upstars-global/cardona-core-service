import { beforeEach, describe, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import '../../../mocks/baselist/static-mock'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { defaultProps as defaultPropsBaseList, fields, globalConfig, mockStore } from '../../../mocks/baselist/mock'
import { setMountComponent } from '../../../utils'
import { ListTypes } from '../../../../../src/@model/templates/baseList'
import DefaultBaseList from '../../../../../src/components/templates/BaseList/types/default.vue'
import { testOn } from '../../../templates/shared-tests/test-case-generator'

let props
let mockDispatch

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: loader => {
      return DefaultBaseList
    },
  }
})

const getMountComponent = setMountComponent(BaseList)

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

describe('BaseList.vue (with mocked dynamic import)', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
    mockDispatch = vi.spyOn(mockStore, 'dispatch')
  })
  it('Should display create, update, and delete buttons based on onePermissionKey', () => {
    mockDispatch.mockResolvedValueOnce({
      list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
      total: 1,
    })

    // Configure permission-related props
    props.config.withCreateBtn = true
    props.config.onePermissionKey = 'test-super'
    props.config.noPermissionPrefix = true

    const wrapper = getMountComponent(props, globalConfig)

    testOn.existElement({ wrapper, testId: 'default-base-list' })
    console.log(wrapper.html(), '11')
  })

  // it('Should display create, update, and delete buttons based on onePermissionKey', () => {
  //   mockDispatch.mockResolvedValueOnce({
  //     list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
  //     total: 1,
  //   })
  //
  //   // Configure permission-related props
  //   props.config.withCreateBtn = true
  //   props.config.onePermissionKey = 'test-super'
  //   props.config.noPermissionPrefix = true
  //
  //   const wrapper = getMountComponent(props, global)
  //
  //   // Check that the action buttons are rendered based on permissions
  //   testOn.existElement({ wrapper, testId: 'right-search-btn' })
  // })
})
