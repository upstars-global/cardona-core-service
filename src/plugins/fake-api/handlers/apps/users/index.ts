import is from '@sindresorhus/is'
import destr from 'destr'
import { rest } from 'msw'
import { db } from '@db/apps/users/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppsUsers = [
  // Get Users Details
  rest.get(('/api/apps/users'), (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const role = req.url.searchParams.get('role')
    const plan = req.url.searchParams.get('plan')
    const status = req.url.searchParams.get('status')
    const sortBy = req.url.searchParams.get('sortBy')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const page = req.url.searchParams.get('page')
    const orderBy = req.url.searchParams.get('orderBy')

    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    // filter users
    let filteredUsers = db.users.filter(user => ((user.fullName.toLowerCase().includes(queryLower) || user.email.toLowerCase().includes(queryLower)) && user.role === (role || user.role) && user.currentPlan === (plan || user.currentPlan) && user.status === (status || user.status))).reverse()

    // sort users
    if (sortByLocal) {
      console.log(sortByLocal)
      if (sortByLocal === 'user') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.fullName.localeCompare(b.fullName)
          else
            return b.fullName.localeCompare(a.fullName)
        })
      }
      if (sortByLocal === 'email') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.email.localeCompare(b.email)
          else
            return b.email.localeCompare(a.email)
        })
      }
      if (sortByLocal === 'role') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.role.localeCompare(b.role)
          else
            return b.role.localeCompare(a.role)
        })
      }
      if (sortByLocal === 'plan') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.currentPlan.localeCompare(b.currentPlan)
          else
            return b.currentPlan.localeCompare(a.currentPlan)
        })
      }
      if (sortByLocal === 'status') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.status.localeCompare(b.status)
          else
            return b.status.localeCompare(a.status)
        })
      }
      if (sortByLocal === 'billing') {
        filteredUsers = filteredUsers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.billing.localeCompare(b.billing)
          else
            return b.billing.localeCompare(a.billing)
        })
      }
    }

    const totalUsers = filteredUsers.length

    // total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPageLocal)

    return res(
      ctx.status(200),
      ctx.json({
        users: paginateArray(filteredUsers, itemsPerPageLocal, pageLocal),
        totalPages,
        totalUsers,
        page: pageLocal > Math.ceil(totalUsers / itemsPerPageLocal) ? 1 : page,
      }),
    )
  }),

  // Get Single User Detail
  rest.get(('/api/apps/users/:id'), (req, res, ctx) => {
    const userId = Number(req.params.id)

    const user = db.users.find(e => e.id === userId)

    if (!user) {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'User not found',
        }),
      )
    }
    else {
      return res(
        ctx.status(200),
        ctx.json(
          {
            ...user,
            ...{
              taskDone: 1230,
              projectDone: 568,
              taxId: 'Tax-8894',
              language: 'English',
            },
          },
        ),
      )
    }
  }),

  // Delete User
  rest.delete(('/api/apps/users/:id'), (req, res, ctx) => {
    const userId = Number(req.params.id)

    const userIndex = db.users.findIndex(e => e.id === userId)

    if (userIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'User not found',
        }),
      )
    }
    else {
      db.users.splice(userIndex, 1)

      return res(
        ctx.status(204),
      )
    }
  }),

  // 👉 Add user
  rest.post(('/api/apps/users'), async (req, res, ctx) => {
    const user = await req.json() as any

    db.users.push({
      ...user,
      id: db.users.length + 1,
    })

    return res(
      ctx.status(201),
      ctx.json({ body: user }),
    )
  }),
]
