import { v4 as uuidv4 } from 'uuid'
import { listImages } from '../../@fake-db/compostela'
import { TransactionType } from '../../@model/enums/playersTransactions'
import type { IDemoTypeItem } from '../../@model/demo'
import { VColors } from '../../@model/vuetify'
import { i18n } from '@/plugins/i18n'

export const entityData = {
  id: '2',
  phoneList: [{ phone: '1234567890', country: '1' }],
  switch: true,
  switchWithState: true,
  text: 'Some text',
  textWithCb: 'text-with-cb',
  number: 999,
  minute: 12,
  minutesRange: { from: 12, to: 34 },
  sumRange: { from: 100, to: 500 },
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
  digits: 3535,
  password: 'qazXSW123@Nik12',
  passwordWithGenerator: 'qazXSW123@Nik12',
  phone: '+380957777888',
  email: 'test@test.com',
  check: true,
  radio: true,
  checkGroup: ['option3', 'option5'],
  nonClearableSelect: 'option8',
  select: 'option3',
  multiSelect: ['option4', 'option7'],
  date: '2023-11-10T10:10:00.000Z',
  dateTime: '2023-11-10T10:10:00.000Z',
  dateRangeFrom: '2023-11-10T10:10:00.000Z',
  dateRangeTo: '2023-11-20T20:20:00.000Z',
  dateTimeRangeFrom: '2023-11-10T10:10:00.000Z',
  dateTimeRangeTo: '2023-11-20T20:20:00.000Z',
  time: '22:55',
  dateBtn: '07-03-2022',
  textarea: 'Some text',
  textareaWithAutoHeight: 'Some text for auto height',
  textareaWithCounter: 'Some text',
  credit: '4242 4242 4242 4242',
  url: 'https://cardona-develop.upstr.to/alaro/',
  tags: ['some', 'tag', 'first'],
  conditions: 'ltp partnerIdMatch(needle)',
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
  usersList: ['user1', 'user2', 'user3'],
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
    'qweqwe': {
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
  {
    id: '638f1a4c9bb32010930bf239',
    name: 'test 9',
  },
  {
    id: '638f1a4c9bb32010930bf2312',
    name: 'test 10',
  },
  {
    id: '638f1a4c9bb32010930bf2392',
    name: 'test 11',
  },
  {
    id: '638f1a4c9bb32010930bf2329',
    name: 'test 12',
  },
  {
    id: '638f1a4c9sbb32010930bf239',
    name: 'test 13',
  },
  {
    id: '638f1a4c9sbb3201093s0bf239',
    name: 'test 14',
  },
]

const baseListData = [
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-11-30T10:00:00+00:00',
    email: 'test@test.com',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    buttonName: 'Test button name',
    login: 'My login',
    localization: 'en',
    country: 'en',
    position: 1,
    imagePath: listImages[0].publicPath,
    editableField: { from: 11, to: 22 },
    imageFull: {
      imagePath: listImages[0].publicPath,
      id: '632c39448e03b2dab20c8a77',
    },
    tags: tagsList,
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
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
    isActive: true,
    amount: 1000,
    currency: 'USD',
    wagerValue: '77000',
    wagerLimit: '3200',
    status: 'active',
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-10-31T10:00:00+00:00',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
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
    editableField: { from: 11, to: 22 },
    tags: [tagsList[3], tagsList[4], tagsList[5]],
    type: {
      id: TransactionType.Payout,
      name: i18n.t('common.payout'),
    },
    gameId: '622c39448e03b2dab20c8a78',
    state: false,
    comment: 'Some',
    paymentsToday: '100',
    paymentsWeek: '1100',
    paymentsMonth: '11100',

    rowVariant: VColors.Error,
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-09-31T10:00:00+00:00',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'Test button name',
    login: 'cwilliams1956@game.com',
    position: 1,
    imagePath: listImages[3].publicPath,
    imageFull: {
      imagePath: listImages[1].publicPath,
      id: '632c39448e03b2dab20c8a78',
    },
    editableField: { from: 11, to: 22 },
    tags: [tagsList[1], tagsList[6], tagsList[5]],
    gameId: '622c39448e03b2dab20c8a79',
    state: true,
    comment: '',
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    paymentsToday: '200',
    paymentsWeek: '2200',
    paymentsMonth: '22200',
    rowVariant: VColors.Info,
  },
  {
    id: '632c39448e03b2dab20c8a75',
    shortId: '632c39448e03b2dab20c8a75',
    partnerCode: '8a632c39448e03b2dab20c8a75',
    name: 'Test',
    nameWithShortId: 'Test',
    isActive: true,
    localization: 'en',
    status: 'delete',
    amount: 20000,
    currency: 'USD',
    wagerValue: '40200',
    wagerLimit: '30990',
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-12-31T10:00:00+00:00',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    callbackData: {
      id: 1,
      name: 'Leanne Graham',
      username: 'Bret',
      email: 'Sincere@april.biz',
      address: {
        street: 'Kulas Light',
        suite: 'Apt. 556',
        city: 'Gwenborough',
        zipcode: '92998-3874',
        geo: {
          lat: '-37.3159',
          lng: '81.1496',
        },
      },
      phone: '1-770-736-8031 x56442',
      website: 'hildegard.org',
      company: {
        name: 'Romaguera-Crona',
        catchPhrase: 'Multi-layered client-server neural-net',
        bs: 'harness real-time e-markets',
      },
    },
    email: 'test@test.com',
    buttonName: 'Some name',
    login: '',
    position: 55,
    imagePath: listImages[4].publicPath,
    editableField: { from: 11, to: 22 },
    imageFull: {
      imagePath: listImages[4].publicPath,
      id: '632c39448e03b2dab20c8a75',
    },
    tags: [tagsList[1], tagsList[8], tagsList[9]],
    gameId: '622c39448e03b2dab20c8a75',
    state: true,
    comment: 'Some commmmmmmmmmmmmmment Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    paymentsToday: '300',
    paymentsWeek: '3300',
    paymentsMonth: '33300',

    rowVariant: VColors.Warning,
  },
  {
    id: '132c39448e03b2dab20c8a77',
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-11-30T10:00:00+00:00',
    email: 'test@test.com',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
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
    editableField: { from: 11, to: 22 },
    tags: [tagsList[0], tagsList[1], tagsList[2]],
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    gameId: '622c39448e03b2dab20c8a77',
    state: true,
    comment:
            'Some commmmmmmmmmmmmmment Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
  },
  {
    id: '132c39448e03b2dab20c8a78',
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-10-31T10:00:00+00:00',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
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
    editableField: { from: 11, to: 22 },
    tags: [tagsList[3], tagsList[4], tagsList[5]],
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    gameId: '622c39448e03b2dab20c8a78',
    state: false,
    comment: 'Some',
    paymentsToday: '100',
    paymentsWeek: '1100',
    paymentsMonth: '11100',

    rowVariant: VColors.Error,
  },
  {
    id: '132c39448e03b2dab20c8a79',
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-09-31T10:00:00+00:00',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    email: 'test@test.com',
    buttonName: 'Test button name',
    login: 'cwilliams1956@game.com',
    position: 1,
    imagePath: listImages[3].publicPath,
    imageFull: {
      imagePath: listImages[1].publicPath,
      id: '632c39448e03b2dab20c8a78',
    },
    editableField: { from: 11, to: 22 },
    tags: [tagsList[1], tagsList[6], tagsList[5]],
    gameId: '622c39448e03b2dab20c8a79',
    state: true,
    comment: '',
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    paymentsToday: '200',
    paymentsWeek: '2200',
    paymentsMonth: '22200',

    rowVariant: VColors.Info,
  },
  {
    id: '132c39448e03b2dab20c8a75',
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-12-31T10:00:00+00:00',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
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
    editableField: { from: 11, to: 22 },
    tags: [tagsList[1], tagsList[8], tagsList[9]],
    gameId: '622c39448e03b2dab20c8a75',
    state: true,
    comment: 'Some commmmmmmmmmmmmmment',
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    paymentsToday: '300',
    paymentsWeek: '3300',
    paymentsMonth: '33300',

    rowVariant: VColors.Warning,
  },
  {
    id: '132c39448e03e2dab20c8a77',
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-11-30T10:00:00+00:00',
    email: 'test@test.com',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
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
    editableField: { from: 11, to: 22 },
    tags: [tagsList[0], tagsList[1], tagsList[2]],
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    gameId: '622c39448e03b2dab20c8a77',
    state: true,
    comment:
            'Some commmmmmmmmmmmmmment Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum',
  },
  {
    id: '232c39448e03b2dab20c8a78',
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
    date: '2024-12-31T10:00:00+00:00',
    newDate: '2024-10-31T10:00:00+00:00',
    period: {
      dateFrom: '2024-12-31T10:00:00+00:00',
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
    editableField: { from: 11, to: 22 },
    tags: [tagsList[3], tagsList[4], tagsList[5]],
    type: {
      id: TransactionType.Deposit,
      name: i18n.t('common.deposit'),
    },
    gameId: '622c39448e03b2dab20c8a78',
    state: false,
    comment: 'Some',
    paymentsToday: '100',
    paymentsWeek: '1100',
    paymentsMonth: '11100',

    rowVariant: VColors.Error,
  },
]

const replaceIdsInList = items => items.map(item => ({ ...item, id: uuidv4() }))
export const listData = [...baseListData, ...replaceIdsInList(baseListData), ...replaceIdsInList(baseListData), ...replaceIdsInList(baseListData)]
