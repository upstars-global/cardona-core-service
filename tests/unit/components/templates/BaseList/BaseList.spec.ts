import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import '../../../mocks/baselist/static-mock'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { defaultProps as defaultPropsBaseList, fields, globalConfig, mockStore } from '../../../mocks/baselist/mock'
import { setMountComponent } from '../../../utils'
import { ListTypes } from '../../../../../src/@model/templates/baseList'
import DefaultBaseList from '../../../../../src/components/templates/BaseList/types/default.vue'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { mockBaseStoreCore } from '../../../mocks/baselist/utils'

let props
let mockDispatch

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: () => DefaultBaseList,
  }
})

const getMountComponent = setMountComponent(BaseList)

const defaultProps = {
  config: defaultPropsBaseList.config,
  useList: () => ({
    ListFilterModel: class PassthroughFilter {
      constructor(data?: any) {
        Object.assign(this, data)
      }
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

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should run set valid component and call fetch', async () => {
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
      list: [{ id: 1, name: 'Item 1', type: 'Type 1', status: 'Status 1' }],
      total: 1,
    })

    props.config.onePermissionKey = 'test-super'

    const wrapper = getMountComponent(props, globalConfig)

    testOn.existElement({ wrapper, testId: 'default-base-list' })

    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled()
  })
})
