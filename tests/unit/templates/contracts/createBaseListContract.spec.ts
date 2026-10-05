import '../../mocks/base-list/static-mock'
import { useList } from '../../mocks/base-list/utils'
import { createBaseListContract } from './createBaseListContract'

createBaseListContract({
  useList,
  expectedEntityName: 'Test',
  sampleBackendResponse: {
    id: 1,
    name: 'Item 1',
    type: 'Type 1',
    status: 'Status 1',
  },
  actions: {
    fetch: { expect: 'fetchEntityList', assertPayload: true },
    delete: { expect: 'deleteEntity', refetchesAfter: true },
    toggleStatus: { expect: 'baseStoreCore.updateEntity' },
  },
})
