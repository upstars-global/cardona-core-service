import mock from '@/@fake-db/mock'

// ------------------------------------------------
// GET: Return Players
// ------------------------------------------------
mock.onPost('/players/list').reply((config) => {
  return [
    200,
    {
      responseId: 'string',
      data: [
        {
          id: '1',
          email: 'cwilliams1956@game.com',
          login: 'cwilliams1956',
        },
        {
          id: '2',
          email: 'artamonovboris@yandex.ru',
          login: 'artamonovboris',
        },
        {
          id: '3',
          email: 'smith093283@yahoo.com',
          login: 'smith093283',
        },
      ],
    },
  ]
})
