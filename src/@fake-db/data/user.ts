import mock from '@/@fake-db/mock'

const data = {
  users: [
    {
      user: 1,
      email: 'wsomerlie1l@accuweather.com',
      groups: ['Group name', 'Operation'],
      projects: [],
      status: 'active',
      actions: null,
    },
    {
      user: 2,
      email: 'wsomerlie1l@accuweather.com',
      groups: [],
      projects: [],
      status: 'active',
      actions: null,
    },
    {
      user: 3,
      email: 'wsomerlie1l@accuweather.com',
      groups: [],
      projects: [],
      status: 'inactive',
      actions: null,
    },
    {
      user: 4,
      email: 'wsomerlie1l@accuweather.com',
      groups: [],
      projects: [],
      status: 'inactive',
      actions: null,
    },
    {
      user: 5,
      email: 'wsomerlie1l@accuweather.com',
      groups: [],
      projects: [],
      status: 'active',
      actions: null,
    },
  ],
}

// ------------------------------------------------
// GET: Return Users
// ------------------------------------------------
mock.onGet('/users').reply((config) => {
  return [
    200,
    {
      users: data.users,
      total: data.users.length,
    },
  ]
})

// ------------------------------------------------
// POST: Add new user
// ------------------------------------------------
mock.onPost('/apps/user/users').reply((config: any) => {
  // Get event from post data
  const { user } = JSON.parse(config.data)

  // Assign Status
  user.status = 'active'

  const { length } = data.users
  let lastIndex = 0
  if (length) {
    lastIndex = (data.users[length - 1] as any).id
  }
  user.id = lastIndex + 1

  data.users.push(user)

  return [201, { user }]
})

// ------------------------------------------------
// GET: Return Single User
// ------------------------------------------------
mock.onGet(/\/apps\/user\/users\/\d+/).reply((config: any) => {
  // Get event id from URL
  let userId = config.url.substring(config.url.lastIndexOf('/') + 1)

  // Convert Id to number
  userId = Number(userId)

  const userIndex = data.users.findIndex((e: any) => e.id === userId)
  const user = data.users[userIndex]

  if (user) return [200, user]
  return [404]
})
