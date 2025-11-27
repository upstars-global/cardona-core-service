import mock from '../../mock'

// import store from '../../../store'
import { useUserStore } from '../../../stores/user'

mock.onPost('api/v2/permission/read').reply(() => [
  200,
  {
    data: {
      id: 'demo',
      users: [],

      // permissions: store.getters['userInfo'].permissions,
      permissions: useUserStore().userInfo.permissions,
    },
  },
])
mock.onPost('api/v2/permission/update').reply(({ data }) => {
  return [200, { data }]
})
