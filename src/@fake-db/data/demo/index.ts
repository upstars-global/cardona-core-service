import mock from '../../mock'
import { PaginationData } from '../../../@model'

const data = [
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
    newDate: '2022-12-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    buttonName: 'Test button name',
    position: 1,
    imagePath: '/svc/img/i/ThorDevelop/banners/f16c86bc_4a13_4426_a278_c9de1a211e99_png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test1',
        position: 3,
      },
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test2',
        position: 23,
      },
    ],
    state: true,
    comment: 'Some commmmmmmmmmmmmmment',
  },
  {
    id: '632c39448e03b2dab20c8a77',
    name: 'Test1',
    isActive: false,
    amount: 1000,
    currency: 'USD',
    wagerValue: '77000',
    wagerLimit: '3200',
    status: 'active',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-12-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    buttonName: 'button name',
    position: 4,
    imagePath: '/svc/img/i/ThorDevelop/banners/5394d94a_63be_4e39_8d23_9269320c13c1_png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test1',
        position: 5,
      },
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test2',
      },
    ],
    state: false,
    comment: 'Some',
  },
  {
    id: '632c39448e03b2dab20c8a77',
    name: 'Test2',
    isActive: true,
    amount: 0,
    currency: 'EUR',
    wagerValue: '0',
    wagerLimit: '0',
    status: 'inactive',
    date: '2022-12-31T10:00:00+00:00',
    newDate: '2022-12-31T10:00:00+00:00',
    period: {
      dateFrom: '2022-12-31T10:00:00+00:00',
      dateTo: '2024-04-26T20:59:00+00:00',
    },
    buttonName: 'Test button name',
    position: 1,
    imagePath: '/svc/img/i/ThorDevelop/banners/309f0a98_60dd_4b01_aed4_5dc811f5abd5_png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test1',
        position: 3,
      },
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test2',
        position: 23,
      },
    ],
    state: true,
    comment: '',
  },
  {
    id: '632c39448e03b2dab20c8a77',
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
    buttonName: 'Some name',
    position: 55,
    imagePath: '/svc/img/i/ThorDevelop/banners/f16c86bc_4a13_4426_a278_c9de1a211e99_png',
    tags: [
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test1',
      },
      {
        id: '638f1a4c9bb32010930bf232',
        name: 'test2',
      },
    ],
    state: true,
    comment: 'Some commmmmmmmmmmmmmment',
  },
]

const pagination: PaginationData = { pageNumber: 1, perPage: 10, total: 4 }
mock.onPost('/api/v2/demo/list').reply(() => [200, { data, pagination }])