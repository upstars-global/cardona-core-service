import is from '@sindresorhus/is'
import destr from 'destr'
import { rest } from 'msw'
import { database } from '@db/apps/invoice/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppsInvoice = [

  // 👉 Client
  // Get Clients
  rest.get(('/api/apps/invoice/clients'), (req, res, ctx) => {
    const clients = database.map(invoice => invoice.client)

    return res(
      ctx.status(200),
      ctx.json(clients.splice(0, 5)),
    )
  }),

  // 👉 Invoice
  // Get Invoice List
  rest.get(('/api/apps/invoice'), (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const status = req.url.searchParams.get('status')
    const selectedDateRange = req.url.searchParams.get('selectedDateRange')
    const page = req.url.searchParams.get('page')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const sortBy = req.url.searchParams.get('sortBy')
    const orderBy = req.url.searchParams.get('orderBy')

    const searchQuery = is.string(q) ? q : undefined
    const queryLowered = (searchQuery ?? '').toString().toLowerCase()

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    const parsedDateRange = destr(selectedDateRange) as unknown as { start?: string; end?: string }
    const startDateLocal = parsedDateRange?.start
    const endDateLocal = parsedDateRange?.end

    // Filtering invoices
    let filteredInvoices = database.filter(
      invoice => (
        (
          invoice.client.name.toLowerCase().includes(queryLowered)
                  || invoice.client.companyEmail.toLowerCase().includes(queryLowered) || invoice.id.toString().includes(queryLowered)
        )
              && invoice.invoiceStatus === (status || invoice.invoiceStatus)
      ),

    ).reverse()

    // Sorting invoices
    if (sortByLocal) {
      if (sortByLocal === 'client') {
        filteredInvoices = filteredInvoices.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.client.name.localeCompare(b.client.name)

          return b.client.name.localeCompare(a.client.name)
        })
      }
      else if (sortByLocal === 'total') {
        filteredInvoices = filteredInvoices.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.total - b.total

          return b.total - a.total
        })
      }
      else if (sortByLocal === 'id') {
        filteredInvoices = filteredInvoices.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.id - b.id

          return b.id - a.id
        })
      }
      else if (sortByLocal === 'date') {
        filteredInvoices = filteredInvoices.sort((a, b) => {
          if (orderByLocal === 'asc')
            return new Date(a.issuedDate).getTime() - new Date(b.issuedDate).getTime()

          return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
        })
      }
      else if (sortByLocal === 'balance') {
        filteredInvoices = filteredInvoices.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.balance - b.balance

          return b.balance - a.balance
        })
      }
    }

    // filtering invoices by date
    if (startDateLocal && endDateLocal) {
      filteredInvoices = filteredInvoices.filter(invoiceObj => {
        const start = new Date(startDateLocal).getTime()
        const end = new Date(endDateLocal).getTime()
        const issuedDate = new Date(invoiceObj.issuedDate).getTime()

        return issuedDate >= start && issuedDate <= end
      })
    }

    const totalInvoices = filteredInvoices.length

    return res(
      ctx.status(200),
      ctx.json(
        {
          invoices: paginateArray(filteredInvoices, itemsPerPageLocal, pageLocal),
          totalInvoices,
        },
      ),
    )
  }),

  // Get Single Invoice
  rest.get(('/api/apps/invoice/:id'), (req, res, ctx) => {
    const invoiceId = req.params.id

    const invoice = database.find(e => e.id === Number(invoiceId))

    if (!invoice) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'No invoice found with this id' }),
      )
    }

    const responseData = {
      invoice,
      paymentDetails: {
        totalDue: '$12,110.55',
        bankName: 'American Bank',
        country: 'United States',
        iban: 'ETD95476213874685',
        swiftCode: 'BR91905',
      },
    }

    return res(
      ctx.status(200),
      ctx.json(responseData),
    )
  }),

  // Delete Invoice
  rest.delete(('/api/apps/invoice/:id'), (req, res, ctx) => {
    const invoiceId = req.params.id

    const invoiceIndex = database.findIndex(e => e.id === Number(invoiceId))

    if (invoiceIndex >= 0) {
      database.splice(invoiceIndex, 1)

      return res(
        ctx.status(200),
      )
    }

    return res(
      ctx.status(404),
      ctx.json({ error: 'something went wrong' }),
    )
  }),

]
