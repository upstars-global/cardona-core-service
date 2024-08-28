import { defineEventHandler } from 'h3'

export default defineEventHandler(async event => {
  try {
    if (getRequestURL) {
      const request = event.node.req

      const url = new URL(getRequestURL(event))

      if (url?.origin)
        return fetch(new Request(`${url.origin}/index.html`, request))
    }

    // Пытаемся обработать запрос дальше
    await event.node.resolved
  }
  catch (e) {
    event.res.statusCode = 404
    event.res.end('Page not found')
  }
})
