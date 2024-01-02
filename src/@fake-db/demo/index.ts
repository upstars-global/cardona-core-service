import mock from '../mock'
import { filterDemoList } from '../../@fake-db/helpers/filterDemoList'
import { entityData, listData } from '../../@fake-db/demo/demoListData'

// List
mock.onPost('/api/v2/demo/list').reply(({ data }) => {
  const { filter, pagination } = JSON.parse(data)
  const filteredList = filterDemoList(listData, filter)

  return new Promise(resolve => {
    setTimeout(() => {
      resolve([200, { data: filteredList.slice(0, pagination.perPage), pagination: { total: filteredList.length, perPage: pagination.perPage, pageNumber: pagination.page } }])
    }, 200)
  })
})

// CRUD
mock.onPost('/api/v2/demo/read').reply(() => {
  return [
    200,
    {
      data: entityData,
    },
  ]
})

mock.onPost('/api/v2/demo/create').reply(({ data }) => {
  const error = {
    type: 'VALIDATION',
    description: 'Validation error',
    validationErrors: new Array<{ field: string; code: string; template: string }>(),
  }

  const object = JSON.parse(data)
  if (object.data.text === entityData.text) {
    error.validationErrors.push({
      field: 'text',
      code: 'ALREADY_EXISTS',
      template: 'This entry already exists in the collection',
    })
  }

  return [
    200,
    {
      data: error.validationErrors.length ? null : object.data,
      error: error.validationErrors.length ? error : null,
    },
  ]
})
mock.onPost('/api/v2/demo/update').reply(() => [200, { data: null }])
mock.onPost('/api/v2/demo/delete').reply(() => [200, { data: null }])

// Options
const options = [
  {
    id: 'option1',
    name: 'Option 1',
  },
  {
    id: 'option2',
    name: 'Option 2',
  },
  {
    id: 'option3',
    name: 'Option 3',
  },
  {
    id: 'option4',
    name: 'Option 4',
  },
  {
    id: 'option5',
    name: 'Option 5',
  },
  {
    id: 'option6',
    name: 'Option 6',
  },
  {
    id: 'option7',
    name: 'Option 7',
  },
  {
    id: 'option8',
    name: 'Option 8',
  },
  {
    id: 'option9',
    name: 'Option 9',
  },
]

mock.onPost('/api/v2/options/list').reply(() => [200, { data: options }])

const conditions = [
  'ltp',
  'playerId',
  'partnerId',
  'approvedPayoutsCount',
  'adc(LastMonth)',
  'partnerIdMatch(needle)',
]

mock.onPost('/api/v2/conditions/list').reply(() => [200, { data: conditions }])
