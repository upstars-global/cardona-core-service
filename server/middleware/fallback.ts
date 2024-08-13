import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineEventHandler, send } from 'h3'

export default defineEventHandler(async event => {
  try {
    if(!event.res.writableEnded) {
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
    const indexPath = resolve('public/index.html')
    const indexPath2 = resolve('./index.html')
    const indexPath3 = resolve('../index.html')
    const indexFile = readFileSync(indexPath) || readFileSync(indexPath2) || readFileSync(indexPath3)

    if (indexFile) {
      event.node.res.statusCode = 200
      event.node.res.setHeader('Content-Type', 'text/html')

      return send(event, indexFile)
    }

    event.res.statusCode = 404
    event.res.end('Page not found')
  }
})
