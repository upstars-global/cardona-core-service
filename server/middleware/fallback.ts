import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineEventHandler, send } from 'h3'

export default defineEventHandler(async event => {
  try {
    // Пытаемся обработать запрос дальше
    await event.node.resolved
  }
  catch (e) {
    // Если произошла ошибка (например, 404), возвращаем index.html
    if (e.statusCode === 404) {
      const indexPath = resolve('public/index.html')
      const indexFile = readFileSync(indexPath)

      event.node.res.statusCode = 200
      event.node.res.setHeader('Content-Type', 'text/html')

      return send(event, indexFile)
    }
  }
})
