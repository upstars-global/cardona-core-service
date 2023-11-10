import mock from '../mock'
import type { PaginationData } from '../../../@model'

// List
export const listImages = [
  {
    type: 'IMAGE',
    path: '/demo-images/1.png',
    publicPath: '/demo-images/1.png',
  },
  {
    type: 'IMAGE',
    path: '/demo-images/2.png',
    publicPath: '/demo-images/2.png',
  },
  {
    type: 'IMAGE',
    path: '/demo-images/3.png',
    publicPath: '/demo-images/3.png',
  },
  {
    type: 'IMAGE',
    path: '/demo-images/4.png',
    publicPath: '/demo-images/4.png',
  },
  {
    type: 'IMAGE',
    path: '/demo-images/5.png',
    publicPath: '/demo-images/5.png',
  },
  {
    type: 'IMAGE',
    path: '/demo-images/6.png',
    publicPath: '/demo-images/6.png',
  },
  {
    type: 'IMAGE',
    path: '/demo-images/7.png',
    publicPath: '/demo-images/7.png',
  },
]

const pagination: PaginationData = { pageNumber: 1, perPage: 10, total: 4 }

mock.onPost('api/v2/compostela/structure/list').reply(({}) => {
  return [200, { data: listImages, pagination }]
})

mock.onPost('/api/v2/demo/create').reply(() => [200, { data: null }])
mock.onPost('/api/v2/demo/update').reply(() => [200, { data: null }])
mock.onPost('/api/v2/demo/delete').reply(() => [200, { data: null }])
