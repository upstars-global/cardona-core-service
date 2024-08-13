import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineEventHandler, send } from 'h3'

export default defineEventHandler(async event => {
  try {
    console.log(event)
    if(!event.res.writableEnded) {
      const indexPath = resolve('./index.html')
      const indexFile = readFileSync(indexPath)

      event.node.res.statusCode = 200
      event.node.res.setHeader('Content-Type', 'text/html')

      return send(event, indexFile)
    }
    // Пытаемся обработать запрос дальше
    await event.node.resolved
  }
  catch (e) {
    event.res.statusCode = 404
    event.res.end('Page not found')
  }
})
