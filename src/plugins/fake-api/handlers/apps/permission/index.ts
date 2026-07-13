import { destr } from 'destr'
import { rest } from 'msw'
import { db } from '@db/apps/permission/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppsPermission = [
  // 👉 Get Permission List
  rest.get(('/api/apps/permissions'), (req, res, ctx) => {
    const q = req.url.searchParams.get('q') || ''
    const sortBy = req.url.searchParams.get('sortBy')
    const page = req.url.searchParams.get('page') || 1
    const itemsPerPage = req.url.searchParams.get('itemsPerPage') || 10
    const orderBy = req.url.searchParams.get('orderBy')

    const parsedSortBy = destr(sortBy)
    const sortByLocal = typeof parsedSortBy === 'string' ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = typeof parsedOrderBy === 'string' ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = typeof parsedItemsPerPage === 'number' ? parsedItemsPerPage : 10
    const pageLocal = typeof parsedPage === 'number' ? parsedPage : 1

    const searchQuery = typeof q === 'string' ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()

    let filteredPermissions = db.permissions.filter(
      permissions =>
        permissions.name.toLowerCase().includes(queryLower)
        || permissions.createdDate.toLowerCase().includes(queryLower)
        || permissions.assignedTo.some((i: string) => i.toLowerCase().startsWith(queryLower)),
    )

    // Sorting Permissions
    if (sortByLocal && sortByLocal === 'name') {
      filteredPermissions = filteredPermissions.sort((a, b) => {
        if (orderByLocal === 'asc')
          return a.name.localeCompare(b.name)

        return b.name.localeCompare(a.name)
      })
    }

    // return response with paginated data
    return res(ctx.status(200), ctx.json({
      permissions: paginateArray(filteredPermissions, itemsPerPageLocal, pageLocal),
      totalPermissions: filteredPermissions.length,
    }))
  }),
]
