import '../../../../mocks/base-list/static-mock'
import { beforeEach, describe, it } from 'vitest'
import { cloneDeep } from 'lodash'
import { flushPromises } from '@vue/test-utils'
import { testOn } from '../../../../templates/shared-tests/test-case-generator'
import {
  defaultProps,
  exportDataMock, getMountCompactComponent,
  global,
  mockBaseStoreCore,
} from '../../../../mocks/base-list/utils'

let props

describe('BaseList Compact', () => {
  beforeEach(() => {
    exportDataMock()
    props = cloneDeep({
      ...defaultProps,
      config: {
        ...defaultProps.config,
        pagination: true,
      },
    })
  })

  it('Should display pagination-meta even when list is empty', async () => {
    mockBaseStoreCore.fetchEntityList.mockResolvedValueOnce({
      list: [],
      total: 0,
    })

    const wrapper = getMountCompactComponent(props, global)

    await flushPromises()

    testOn.existElement({ wrapper, testId: 'pagination-meta' })
  })
})
