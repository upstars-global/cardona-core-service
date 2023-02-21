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
// GET: Return Groups
// ------------------------------------------------
mock.onPost('/groups/list').reply((config) => {
  return [
    200,
    {
      responseId: 'any',
      error: null,
      pagination: { pageNumber: 1, perPage: 10, total: 2 },
      data: [
        {
          id: 1,
          title: 'Group1',
          users: [
            {
              id: '1',
              userName: 'admin1',
            },
          ],
          usersCount: 1,
        },
        {
          id: 2,
          title: 'Group1',
          users: [
            {
              id: '1',
              userName: 'admin1',
            },
          ],
          usersCount: 1,
        },
      ],
    },
  ]
})
