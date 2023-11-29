import { rest } from 'msw'
import { db } from '@/plugins/fake-api/handlers/dashboard/db'

export const handlerDashboard = [
  rest.get('/api/dashboard/analytics/projects', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(db.analytics),
    )
  }),
]
