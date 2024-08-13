import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineEventHandler, send } from 'h3'

export default defineEventHandler(async event => {
  try {
    if (!event.res.writableEnded) {
      const indexPath = resolve('public/index.html')
      const indexFile = readFileSync(indexPath)

      event.node.res.statusCode = 200
      event.node.res.setHeader('Content-Type', 'text/html')

      return send(event, indexFile)
    }

    // Пытаемся обработать запрос дальше
    await event.node.resolved
  }
  catch (e) {
    const request = event.node.req
    console.log(request.url)
    console.log(event)

    return await fetch('https://bac-3366-add-middleware.cardona-core-service.pages.dev/index.html')
  }
})
