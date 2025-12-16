import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cloneDeep } from 'lodash'
import '../../../mocks/baselist/static-mock'
import BaseList from '../../../../../src/components/templates/BaseList/index.vue'
import { setMountComponent } from '../../../utils'
import DefaultBaseList from '../../../../../src/components/templates/BaseList/types/default.vue'
import { testOn } from '../../../templates/shared-tests/test-case-generator'
import { mockBaseStoreCore } from '../../../mocks/baselist/utils'
import { defaultProps, global } from '../../../mocks/base-list/utils'

let props

vi.mock('vue', async importOriginal => {
  const vue = await importOriginal()

  return {
    ...vue,
    defineAsyncComponent: () => DefaultBaseList,
  }
})

const getMountComponent = setMountComponent(BaseList)

describe('BaseList.vue (with mocked dynamic import)', () => {
  beforeEach(() => {
    props = cloneDeep(defaultProps)
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

    const wrapper = getMountComponent(props, global)

    testOn.existElement({ wrapper, testId: 'default-base-list' })

    expect(mockBaseStoreCore.fetchEntityList).toHaveBeenCalled()
  })
})
