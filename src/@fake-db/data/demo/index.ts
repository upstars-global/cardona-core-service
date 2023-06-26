import mock from '../../mock'
import { PaginationData } from '../../../@model'
import { filterDemoList } from '../../helpers/filterDemoList'
import { TransactionType } from '../../../@model/playersTransactions'
import i18n from '../../../libs/i18n'
import { IDemoTypeItem } from '../../../@model/demo'

export const tagsList: Array<IDemoTypeItem> = [
  {
    id: '638f1a4c9bb32010930bf230',
    name: 'test',
    position: 3,
  },
  {
    id: '638f1a4c9bb32010930bf231',
    name: 'test 1',
    position: 23,
  },
  {
    id: '638f1a4c9bb32010930bf232',
    name: 'test 2',
    position: 5,
  },
  {
    id: '638f1a4c9bb32010930bf233',
    name: 'test 3',
  },
  {
    id: '638f1a4c9bb32010930bf234',
    name: 'test 4',
    position: 3,
  },
  {
    id: '638f1a4c9bb32010930bf235',
    name: 'test 5',
    position: 23,
  },
  {
    id: '638f1a4c9bb32010930bf236',
    name: 'test 6',
    position: 3,
  },
  {
    id: '638f1a4c9bb32010930bf237',
    name: 'test 7',
    position: 23,
  },
  {
    id: '638f1a4c9bb32010930bf238',
    name: 'test 8',
  },
  {
    id: '638f1a4c9bb32010930bf239',
    name: 'test 9',
  },
]
// List
const listData = [
  {
    id: '632c39448e03b2dab20c8a77',
    name: 'Test',
    isActive: true,
    status: 'new',
    amount: 70000,
    currency: 'EUR',
    wagerValue: '4000',
    wagerLimit: '300',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-11-31T10:00:00+00:00',
    email: 'test@test.com',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    buttonName: 'Test button name',
    login: 'My login',
    localization: 'en',
    country: 'en',
    position: 1,
    imagePath: '/svc/img/i/ThorDevelop/banners/f16c86bc_4a13_4426_a278_c9de1a211e99_png',
    tags: [tagsList[0], tagsList[1], tagsList[2]],
    type: {
      id: TransactionType.Deposit,
      name: i18n.t(`common.deposit`),
    },
    gameId: '622c39448e03b2dab20c8a77',
    state: true,
    comment:
      'Some commmmmmmmmmmmmmment Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
  },
  {
    id: '632c39448e03b2dab20c8a78',
    name: 'Test1',
    isActive: false,
    amount: 1000,
    currency: 'USD',
    wagerValue: '77000',
    wagerLimit: '3200',
    status: 'active',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-10-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'button name',
    login: 'Some',
    position: 4,
    imagePath: '/svc/img/i/ThorDevelop/banners/5394d94a_63be_4e39_8d23_9269320c13c1_png',
    tags: [tagsList[3], tagsList[4], tagsList[5]],
    type: {
      id: TransactionType.Deposit,
      name: i18n.t(`common.deposit`),
    },
    gameId: '622c39448e03b2dab20c8a78',
    state: false,
    comment: 'Some',
    paymentsToday: '100',
    paymentsWeek: '1100',
    paymentsMonth: '11100',
  },
  {
    id: '632c39448e03b2dab20c8a79',
    name: 'Test2',
    isActive: true,
    amount: 0,
    currency: 'EUR',
    wagerValue: '0',
    wagerLimit: '0',
    status: 'inactive',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-09-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'Test button name',
    login: 'cwilliams1956@game.com',
    position: 1,
    imagePath: '/svc/img/i/ThorDevelop/banners/309f0a98_60dd_4b01_aed4_5dc811f5abd5_png',
    tags: [tagsList[1], tagsList[6], tagsList[5]],
    gameId: '622c39448e03b2dab20c8a79',
    state: true,
    comment: '',
    type: {
      id: TransactionType.Payout,
      name: i18n.t(`common.payout`),
    },
    paymentsToday: '200',
    paymentsWeek: '2200',
    paymentsMonth: '22200',
  },
  {
    id: '632c39448e03b2dab20c8a75',
    name: 'Test',
    isActive: false,
    status: 'delete',
    amount: 20000,
    currency: 'USD',
    wagerValue: '40200',
    wagerLimit: '30990',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-12-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'Some name',
    login: '',
    position: 55,
    imagePath: '/svc/img/i/ThorDevelop/banners/f16c86bc_4a13_4426_a278_c9de1a211e99_png',
    tags: [tagsList[1], tagsList[8], tagsList[9]],
    gameId: '622c39448e03b2dab20c8a75',
    state: true,
    comment: 'Some commmmmmmmmmmmmmment',
    type: {
      id: TransactionType.Deposit,
      name: i18n.t(`common.deposit`),
    },
    paymentsToday: '300',
    paymentsWeek: '3300',
    paymentsMonth: '33300',
  },
]

const pagination: PaginationData = { pageNumber: 1, perPage: 10, total: 4 }
mock.onPost('/api/v2/demo/list').reply(({ data }) => {
  const { filter } = JSON.parse(data)
  const filteredList = filterDemoList(listData, filter)
  return [200, { data: filteredList, pagination }]
})

// CRUD
const entityData = {
  id: '2',
  switch: true,
  switchWithState: true,
  text: 'Some text',
  number: 99,
  minute: 12,
  sumRange: [1000, 5000],
  percent: 25,
  password: '111111',
  phone: '+380957777888',
  check: true,
  radio: true,
  checkGroup: ['option3', 'option5'],
  select: 'option3',
  multiSelect: ['option4'],
  date: '2023-06-05T00:00:00+00:00',
  dateRange: '',
  dateTime: '2023-06-18T05:55:00+00:00',
  textarea: 'Some text',
  textareaWithCounter: 'Some text',
  tags: ['some', 'tag', 'first'],
}

mock.onPost('/api/v2/demo/read').reply(() => [
  200,
  {
    data: entityData,
  },
])

mock.onPost('/api/v2/demo/create').reply(() => [200, { data: null }])
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
