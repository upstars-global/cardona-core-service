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
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges',
    publicPath: null,
  },
]

const pagination: PaginationData = { pageNumber: 1, perPage: 10, total: 4 }

mock.onPost('api/v2/compostela/structure/list').reply(({}) => {
  return [200, { data: listImages, pagination }]
})

mock.onPost('/api/v2/upload/compostela/image/create').reply(({ data }) => {
  console.log('create', data.get('path'), data.get('file'), data.get('replace'))

  return new Promise(resolve => {
    setTimeout(() => {
      resolve([200, {
        data: {
          id: '6fbae9fa-5154-4e8c-ae8b-0357f9a05683',
          path: '/demo-images/1.png',
          filename: '1.png',
          publicPath: '/demo-images/1.png',
        },
      }])
    }, 1500)
  })
})
mock.onPost('/api/v2/demo/update').reply(() => [200, { data: null }])
mock.onPost('/api/v2/demo/delete').reply(() => [200, { data: null }])
