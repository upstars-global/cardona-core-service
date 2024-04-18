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
    path: '/demo-images/1.png',
    publicPath: '/demo-images/error.png',
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
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges1',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges2',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges3',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges4',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges5',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges6',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges7',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges8',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges9',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges10',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges11',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges12',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges13',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges14',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges15',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges16',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges17',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges18',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges19',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges20',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges21',
    publicPath: null,
  },
  {
    type: 'DIRECTORY',
    path: 'ThorDevelop/badges22',
    publicPath: null,
  },
  {
    type: 'IMAGE',
    path: '/demo-images/1.png',
    publicPath: '/demo-images/1.png',
  },
  {
    type: 'IMAGE',
    path: '/demo-images/1.png',
    publicPath: '/demo-images/error.png',
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

mock.onPost('api/v2/compostela/structure/list').reply(({ data }) => {
  const { pagination } = JSON.parse(data)

  const paginationData: PaginationData = {
    pageNumber: pagination.pageNumber,
    perPage: pagination.perPage,
    total: listImages.length,
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve([200, { data: listImages.slice(pagination.perPage * (pagination.pageNumber - 1), pagination.pageNumber * pagination.perPage), pagination: paginationData }])
    }, 500)
  })
})

mock.onPost('/api/v2/upload/compostela/image/create').reply(({ data }) => {
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
mock.onPost('/api/v2/demo/update/multiple').reply(() => [200, { data: null }])
mock.onPost('/api/v2/demo/delete').reply(() => [200, { data: null }])
mock.onPost('/api/v2/demo/delete/multiple').reply(() => [200, { data: null }])
