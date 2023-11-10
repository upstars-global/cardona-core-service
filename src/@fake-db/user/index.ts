import mock from '../mock'
import { database } from '../jwt'

mock.onPost('api/v2/users/current/read').reply(() => [
  200,
  {
    data: {
      ...database[0],
    },
  },
])
