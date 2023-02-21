const error = [
  {
    path: '/error-404',
    name: 'Error404',
    component: () => import('@/pages/error/404'),
    meta: {
      layout: 'full',
    },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/error/404'),
  },
]

export default error
