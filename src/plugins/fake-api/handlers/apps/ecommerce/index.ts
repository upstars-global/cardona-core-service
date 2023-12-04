import is from '@sindresorhus/is'
import { destr } from 'destr'
import { rest } from 'msw'
import { db } from '@db/apps/ecommerce/db'
import { paginateArray } from '@api-utils/paginateArray'

export const handlerAppsEcommerce = [

  // 👉 Products
  // Get Product List
  rest.get('/api/apps/ecommerce/products', (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const stock = req.url.searchParams.get('stock')
    const category = req.url.searchParams.get('category')
    const status = req.url.searchParams.get('status')
    const sortBy = req.url.searchParams.get('sortBy')
    const orderBy = req.url.searchParams.get('orderBy')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const page = req.url.searchParams.get('page')

    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()

    const parsedStock = destr(stock)
    const stockLocal = is.boolean(parsedStock) ? parsedStock : undefined

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    // Filtering Products
    let filteredProducts = db.products.filter(product => (
      (product.productName.toLowerCase().includes(queryLower) || product.productBrand.toLowerCase().includes(queryLower))
        && product.category === (category || product.category)
        && (product.status === (status || product.status))
        && (typeof stockLocal === 'undefined' ? true : (product.stock === stockLocal))
    )).reverse()

    // Sort
    if (sortByLocal) {
      if (sortByLocal === 'product') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.productName.toLowerCase() > b.productName.toLowerCase() ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.productName.toLowerCase() < b.productName.toLowerCase() ? 1 : -1

          return 0
        })
      }

      if (sortByLocal === 'category') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.category > b.category ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.category < b.category ? 1 : -1

          return 0
        })
      }

      if (sortByLocal === 'status') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.status > b.status ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.status < b.status ? 1 : -1

          return 0
        })
      }

      if (sortByLocal === 'price') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (orderByLocal === 'asc')
            return Number(a.price.slice(1)) > Number(b.price.slice(1)) ? 1 : -1
          else if (orderByLocal === 'desc')
            return Number(a.price.slice(1)) < Number(b.price.slice(1)) ? 1 : -1

          return 0
        })
      }

      if (sortByLocal === 'qty') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.qty > b.qty ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.qty < b.qty ? 1 : -1

          return 0
        })
      }

      if (sortByLocal === 'sku') {
        filteredProducts = filteredProducts.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.sku > b.sku ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.sku < b.sku ? 1 : -1

          return 0
        })
      }
    }

    return res(
      ctx.status(200),
      ctx.json({
        products: paginateArray(filteredProducts, itemsPerPageLocal, pageLocal), total: filteredProducts.length,
      }))
  }),

  // 👉 Delete Product
  rest.delete('/api/apps/ecommerce/products/:id', (req, res, ctx) => {
    const id = Number(req.params.id)

    const productIndex = db.products.findIndex(e => e.id === id)

    if (productIndex >= 0) {
      db.products.splice(productIndex, 1)

      return res(
        ctx.status(204),
      )
    }

    return res(
      ctx.status(404),
    )
  }),

  // 👉 Orders
  // Get Order List
  rest.get('/api/apps/ecommerce/orders', (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const sortBy = req.url.searchParams.get('sortBy')
    const orderBy = req.url.searchParams.get('orderBy')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const page = req.url.searchParams.get('page')

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

    const filterOrders = db.orderData.filter(order => {
      return (
        order.customer.toLowerCase().includes(queryLower)
            || order.email.toLowerCase().includes(queryLower)
            || order.order.toString().includes(queryLower)
      )
    }).reverse()

    if (sortByLocal) {
      console.log(sortByLocal)
      if (sortByLocal === 'order') {
        filterOrders.sort((a, b) => {
          if (orderByLocal === 'desc')
            return b.order - a.order
          else
            return a.order - b.order
        })
      }
      if (sortByLocal === 'customers') {
        filterOrders.sort((a, b) => {
          if (orderByLocal === 'desc')
            return b.customer.localeCompare(a.customer)
          else
            return a.customer.localeCompare(b.customer)
        })
      }

      if (sortByLocal === 'date') {
        filterOrders.sort((a, b) => {
          if (orderByLocal === 'desc')
            return Number(new Date(b.date)) - Number(new Date(a.date))
          else
            return Number(new Date(a.date)) - Number(new Date(b.date))
        })
      }

      if (sortByLocal === 'status') {
        filterOrders.sort((a, b) => {
          if (orderByLocal === 'desc')
            return b.status.localeCompare(a.status)
          else
            return a.status.localeCompare(b.status)
        })
      }

      if (sortByLocal === 'spent') {
        filterOrders.sort((a, b) => {
          if (orderByLocal === 'desc')
            return Number(b.spent) - Number(a.spent)
          else
            return Number(a.spent) - Number(b.spent)
        })
      }
    }

    return res(
      ctx.status(200),
      ctx.json({
        orders: paginateArray(filterOrders, itemsPerPageLocal, pageLocal), total: filterOrders.length,
      }),
    )
  }),

  // Delete Order
  rest.delete('/api/apps/ecommerce/orders/:id', (req, res, ctx) => {
    const id = Number(req.params.id)

    const orderIndex = db.orderData.findIndex(e => e.id === id)

    if (orderIndex >= 0)
      db.orderData.splice(orderIndex, 1)

    return res(
      ctx.status(204),
    )
  }),

  // 👉 Customers
  // Get single Customer
  rest.get(('/api/apps/ecommerce/customers/:id'), (req, res, ctx) => {
    const customerId = Number(req.params.id)

    const customerIndex = db.customerData.findIndex(e => e.customerId === customerId)

    const customer = db.customerData[customerIndex]

    Object.assign(customer, {
      status: 'Active',
      contact: '+1 (234) 567 890',
    })

    if (customer) {
      return res(
        ctx.status(200),
        ctx.json(
          customer,
        ),
      )
    }
    else {
      return res(
        ctx.status(404),
      )
    }
  }),

  // Get Customer List
  rest.get(('/api/apps/ecommerce/customers'), (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const sortBy = req.url.searchParams.get('sortBy')
    const orderBy = req.url.searchParams.get('orderBy')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const page = req.url.searchParams.get('page')

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    const searchQuery = is.string(q) ? q : undefined
    const queryLowered = (searchQuery ?? '').toString().toLowerCase()

    const filteredCustomers = db.customerData.filter(customer => {
      return (
        customer.customer.toLowerCase().includes(queryLowered)
              || customer.country.toLowerCase().includes(queryLowered)
              || customer.email.toLowerCase().includes(queryLowered)
      )
    }).reverse()

    // Sort Customers
    if (sortByLocal) {
      if (sortByLocal === 'customer') {
        filteredCustomers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.customer.localeCompare(b.customer)

          return b.customer.localeCompare(a.customer)
        })
      }
      if (sortByLocal === 'country') {
        filteredCustomers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.country.localeCompare(b.country)

          return b.country.localeCompare(a.country)
        })
      }

      if (sortByLocal === 'customerId') {
        filteredCustomers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.customerId - b.customerId

          return b.customerId - a.customerId
        })
      }

      if (sortByLocal === 'orders') {
        filteredCustomers.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.order - b.order

          return b.order - a.order
        })
      }
    }

    if (sortByLocal === 'totalSpent') {
      filteredCustomers.sort((a, b) => {
        if (orderByLocal === 'asc')
          return a.totalSpent - b.totalSpent

        return b.totalSpent - a.totalSpent
      })
    }

    return res(
      ctx.status(200),
      ctx.json({
        customers: paginateArray(filteredCustomers, itemsPerPageLocal, pageLocal), total: filteredCustomers.length,
      }),
    )
  }),

  // 👉 Manage Reviews.
  // Get Reviews
  rest.get(('/api/apps/ecommerce/reviews'), (req, res, ctx) => {
    const q = req.url.searchParams.get('q')
    const sortBy = req.url.searchParams.get('sortBy')
    const orderBy = req.url.searchParams.get('orderBy')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const status = req.url.searchParams.get('status')
    const page = req.url.searchParams.get('page')

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    const searchQuery = is.string(q) ? q : undefined
    const queryLower = (searchQuery ?? '').toString().toLowerCase()

    // Filtering Reviews

    const filteredReviews = db.reviews.filter(review => {
      const { product, reviewer, email } = review

      return (
        (product.toLowerCase().includes(queryLower) || reviewer.toLowerCase().includes(queryLower) || email.toLowerCase().includes(queryLower) || review.head.toLowerCase().includes(queryLower) || review.para.toLowerCase().includes(queryLower))
        && (review.status === status || status === 'All')
      )
    })

    // Sort
    if (sortByLocal) {
      if (sortByLocal === 'product') {
        filteredReviews.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.product.toLowerCase() > b.product.toLowerCase() ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.product.toLowerCase() < b.product.toLowerCase() ? 1 : -1

          return 0
        })
      }

      if (sortByLocal === 'reviewer') {
        filteredReviews.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.reviewer.toLowerCase() > b.reviewer.toLowerCase() ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.reviewer.toLowerCase() < b.reviewer.toLowerCase() ? 1 : -1

          return 0
        })
      }

      if (sortByLocal === 'date') {
        filteredReviews.sort((a, b) => {
          if (orderByLocal === 'desc')
            return Number(new Date(b.date)) - Number(new Date(a.date))
          else if (orderByLocal === 'asc')
            return Number(new Date(a.date)) - Number(new Date(b.date))

          return 0
        })
      }
    }

    if (sortByLocal === 'status') {
      filteredReviews.sort((a, b) => {
        if (orderByLocal === 'asc')
          return a.status.toLowerCase() > b.status.toLowerCase() ? 1 : -1
        else if (orderByLocal === 'desc')
          return a.status.toLowerCase() < b.status.toLowerCase() ? 1 : -1
        else
          return 0
      })
    }

    return res(
      ctx.status(200),
      ctx.json({
        reviews: paginateArray(filteredReviews, itemsPerPageLocal, pageLocal), total: filteredReviews.length,
      }),
    )
  }),

  // Delete Review
  rest.delete(('/api/apps/ecommerce/reviews/:id'), (req, res, ctx) => {
    const id = Number(req.params.id)

    const reviewIndex = db.reviews.findIndex(e => e.id === id)

    if (reviewIndex !== -1) {
      db.reviews.splice(reviewIndex, 1)

      return res(
        ctx.status(200),
      )
    }

    return res(
      ctx.status(404),
    )
  }),

  // 👉 Referrals
  // Get Referrals
  rest.get(('/api/apps/ecommerce/referrals'), (req, res, ctx) => {
    const sortBy = req.url.searchParams.get('sortBy')
    const orderBy = req.url.searchParams.get('orderBy')
    const itemsPerPage = req.url.searchParams.get('itemsPerPage')
    const page = req.url.searchParams.get('page')

    const parsedSortBy = destr(sortBy)
    const sortByLocal = is.string(parsedSortBy) ? parsedSortBy : ''

    const parsedOrderBy = destr(orderBy)
    const orderByLocal = is.string(parsedOrderBy) ? parsedOrderBy : ''

    const parsedItemsPerPage = destr(itemsPerPage)
    const parsedPage = destr(page)

    const itemsPerPageLocal = is.number(parsedItemsPerPage) ? parsedItemsPerPage : 10
    const pageLocal = is.number(parsedPage) ? parsedPage : 1

    const filteredReferrals = [...db.referrals]

    if (sortByLocal) {
      if (sortByLocal === 'users') {
        filteredReferrals.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.user.localeCompare(b.user)
          else
            return b.user.localeCompare(a.user)
        })
      }

      if (sortByLocal === 'referred-id') {
        filteredReferrals.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.referredId - b.referredId
          else if (orderByLocal === 'desc')
            return b.referredId - a.referredId

          return 0
        })
      }

      if (sortByLocal === 'earning') {
        filteredReferrals.sort((a, b) => {
          if (orderByLocal === 'asc')
            return Number(a.earning.slice(1)) - Number(b.earning.slice(1))
          else if (orderByLocal === 'desc')
            return Number(b.earning.slice(1)) - Number(a.earning.slice(1))

          return 0
        })
      }

      if (sortByLocal === 'value') {
        filteredReferrals.sort((a, b) => {
          if (orderByLocal === 'asc')
            return Number(a.value.slice(1)) - Number(b.value.slice(1))
          else if (orderByLocal === 'desc')
            return Number(b.value.slice(1)) - Number(a.value.slice(1))

          return 0
        })
      }

      if (sortByLocal === 'status') {
        filteredReferrals.sort((a, b) => {
          if (orderByLocal === 'asc')
            return a.status.toLowerCase() > b.status.toLowerCase() ? 1 : -1
          else if (orderByLocal === 'desc')
            return a.status.toLowerCase() < b.status.toLowerCase() ? 1 : -1

          return 0
        })
      }
    }

    return res(
      ctx.status(200),
      ctx.json({
        referrals: paginateArray(filteredReferrals, itemsPerPageLocal, pageLocal),
        total: filteredReferrals.length,
      }),
    )
  }),
]
