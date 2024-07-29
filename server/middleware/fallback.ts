import { promises as fs } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
    // Проверяем, если предыдущие роуты не сработали
    if (!event.res.writableEnded) {
        try {
            const indexPath = resolve('./index.html') // Укажите путь к вашему index.html
            const indexHtml = await fs.readFile(indexPath, 'utf-8')
            event.res.setHeader('Content-Type', 'text/html')
            event.res.end(indexHtml)
        } catch (error) {
            event.res.statusCode = 404
            event.res.end('Page not found')
        }
    }
})