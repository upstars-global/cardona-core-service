import is from '@sindresorhus/is'
import { destr } from 'destr'
import { rest } from 'msw'
import { db } from '@db/apps/logistics/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppLogistics = [
  rest.get(('/api/apps/logistics/vehicles'), (req, res, ctx) => {
    const sortBy = req.url.searchParams.get('sortBy')
    const page = req.url.searchParams.get('page') ?? 1
    const itemsPerPage = req.url.searchParams.get('itemsPerPage') ?? 10
    const orderBy = req.url.searchParams.get('orderBy')

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    // Sorting Vehicles
    let vehicles = [...db.vehicles]

    if (sortBy) {
      if (sortByLocal === 'location') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.location - b.location

          return b.location - a.location
        })
      }

      if (sortByLocal === 'startRoute') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.startCity.localeCompare(b.startCity)

          return b.startCity.localeCompare(a.startCity)
        })
      }

      if (sortByLocal === 'endRoute') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.endCity.localeCompare(b.endCity)

          return b.endCity.localeCompare(a.endCity)
        })
      }

      if (sortByLocal === 'warnings') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.warnings.localeCompare(b.warnings)

          return b.warnings.localeCompare(a.warnings)
        })
      }

      if (sortByLocal === 'progress') {
        vehicles = vehicles.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.progress - b.progress

          return b.progress - a.progress
        })
      }
    }

    return res(
      ctx.status(200),
      ctx.json({
        vehicles: paginateArray(vehicles, itemsPerPageLocal, pageLocal),
        totalVehicles: vehicles.length,
      }),
    )
  }),
]
