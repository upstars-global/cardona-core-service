import mock from '../../mock'
import { PaginationData } from '../../../@model'
import { filterDemoList } from '../../helpers/filterDemoList'
import { TransactionType } from '../../../@model/playersTransactions'
import i18n from '../../../libs/i18n'
import { IDemoTypeItem } from '../../../@model/demo'
import { listImages } from '../compostela/index'
import { BLightColors } from '../../../@model/bootstrap'

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
    shortId: '632c39448e03b2dab20c8a77',
    partnerCode: '123632c39448e03b2dab20c8a77',
    name: 'Test',
    nameWithShortId: 'Test',
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
    imagePath: listImages[0].publicPath,
    imageFull: {
      imagePath: listImages[0].publicPath,
      id: '632c39448e03b2dab20c8a77',
    },
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
    shortId: '632c39448e03b2dab20c8a78',
    partnerCode: '883632c39448e03b2dab20c8a78',
    name: 'Test1',
    nameWithShortId: 'Test1',
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
    imagePath: listImages[1].publicPath,
    imageFull: {
      imagePath: listImages[1].publicPath,
      id: '632c39448e03b2dab20c8a78',
    },
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
    rowVariant: BLightColors.LightDanger,
  },
  {
    id: '632c39448e03b2dab20c8a79',
    shortId: '632c39448e03b2dab20c8a79',
    partnerCode: '783632c39448e03b2dab20c8a78',
    name: 'Test2',
    nameWithShortId: 'Test2',
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
    imagePath: listImages[3].publicPath,
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
    rowVariant: BLightColors.LightInfo,
  },
  {
    id: '632c39448e03b2dab20c8a75',
    shortId: '632c39448e03b2dab20c8a75',
    partnerCode: '8a632c39448e03b2dab20c8a75',
    name: 'Test',
    nameWithShortId: 'Test',
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
    imagePath: listImages[4].publicPath,
    imageFull: {
      imagePath: listImages[4].publicPath,
      id: '632c39448e03b2dab20c8a75',
    },
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
    rowVariant: BLightColors.LightWarning,
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
  minutesRange: { from: 12, to: 34 },
  sumRange: [1000, 5000],
  rates: [
    { currency: 'AUD', bet: 100 },
    { currency: 'NZD', bet: 200 },
    { currency: 'CAD', bet: 300 },
    { currency: 'EUR', bet: 400 },
    { currency: 'USD', bet: 500 },
    { currency: 'INR', bet: 600 },
    { currency: 'BRL', bet: 700 },
  ],
  percent: 25,
  digits: 35,
  password: '111111',
  phone: '+380957777888',
  email: 'test@test.com',
  check: true,
  radio: true,
  checkGroup: ['option3', 'option5'],
  nonClearableSelect: 'option8',
  select: 'option3',
  multiSelect: ['option4', 'option7'],
  date: '2023-06-05T00:00:00+00:00',
  dateRange: '',
  dateTime: '2023-06-18T05:55:00+00:00',
  time: '22:55',
  dateBtn: '07-03-2022',
  textarea: 'Some text',
  textareaWithCounter: 'Some text',
  credit: '4242 4242 4242 4242',
  url: 'https://cardona-develop.upstr.to/alaro/',
  tags: ['some', 'tag', 'first'],
  seo: {
    metaTitle: 'Seo meta title',
    metaDescription: 'Seo meta description',
    description: `  <h1>Welcome to Demo seo data </h1>
  <p>This is a paragraph of mock content.</p>
  <ul>
    <li>Seo text item 1</li>
    <li>Seo text item 2</li>
    <li>Seo text item 3</li>
  </ul>`,
  },
  localisationParameters: {
    'Demo locale params': {
      AUD: '1',
      NZD: '34',
      CAD: '234',
      EUR: '120033',
      USD: '99',
      INR: '2334',
      BRL: '1234',
    },
    qweqwe: {
      RUB: '666',
      USD: '999',
      AUD: '90000',
      NZD: '3333777',
      CAD: '',
      EUR: '',
      INR: '',
      BRL: '',
    },
  },
  fieldTranslations: {
    metaTitle: {
      en: { value: 'Seo meta title', disabled: false },
      en_AU: { value: 'Mock data for en_AU', disabled: true },
      en_CA: { value: 'Mock data for en_CA', disabled: false },
      en_IN: { value: 'Mock data for en_IN', disabled: false },
      en_NZ: { value: 'Mock data for en_NZ', disabled: false },
      es: { value: 'Mock data for es', disabled: false },
      fr: { value: 'Mock data for fr', disabled: false },
      fr_CA: { value: 'Mock data for fr_CA', disabled: false },
      fr_FR: { value: 'Mock data for fr_FR', disabled: false },
      pt: { value: 'Mock data for pt', disabled: false },
      pt_BR: { value: 'Mock data for pt_BR', disabled: false },
    },
    metaDescription: {
      en: { value: 'Some text', disabled: false },
      en_AU: {
        value: `  <h1>Welcome to Demo localize </h1>
  <p>This is a paragraph of mock content.</p>
  <ul>
    <li>English (Australia) 1</li>
    <li>English (Australia) 2</li>
    <li>English (Australia) 3</li>
  </ul>`,
        disabled: undefined,
      },
      en_CA: {
        value: '&nbsp;<span class="variable-box">{Badge variable}</span>&nbsp;',
        disabled: false,
      },
      en_IN: { value: '', disabled: false },
      en_NZ: { value: '', disabled: false },
      es: { value: '', disabled: false },
      fr: { value: '', disabled: false },
      fr_CA: { value: '', disabled: false },
      fr_FR: { value: '', disabled: false },
      pt: { value: '', disabled: false },
      pt_BR: { value: '', disabled: false },
    },
    description: {
      en: { value: 'Seo description', disabled: false },
      en_AU: { value: 'Mock data for en_AU', disabled: false },
      en_CA: { value: 'Mock data for en_CA', disabled: false },
      en_IN: { value: 'Mock data for en_IN', disabled: false },
      en_NZ: { value: 'Mock data for en_NZ', disabled: false },
      es: { value: 'Mock data for es', disabled: false },
      fr: { value: 'Mock data for fr', disabled: false },
      fr_CA: { value: 'Mock data for fr_CA', disabled: false },
      fr_FR: { value: 'Mock data for fr_FR', disabled: false },
      pt: { value: 'Mock data for pt', disabled: false },
      pt_BR: { value: 'Mock data for pt_BR', disabled: false },
    },
  },
  image: listImages[0].publicPath,
}
mock.onPost('/api/v2/demo/read').reply(() => [
  200,
  {
    data: entityData,
  },
])

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
    name: 'Label option 1',
  },
  {
    id: 'option2',
    name: 'Label option 2',
  },
  {
    id: 'option3',
    name: 'Label option 3',
  },
  {
    id: 'option4',
    name: 'Label option 4',
  },
  {
    id: 'option5',
    name: 'Label option 5',
  },
  {
    id: 'option6',
    name: 'Label option 6',
  },
  {
    id: 'option7',
    name: 'Label option 7',
  },
  {
    id: 'option8',
    name: 'Label option 8',
  },
  {
    id: 'option9',
    name: 'Label option 9',
  },
]

mock.onPost('/api/v2/options/list').reply(() => [200, { data: options }])
