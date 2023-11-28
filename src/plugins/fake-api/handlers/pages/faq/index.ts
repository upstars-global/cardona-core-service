import is from '@sindresorhus/is'
import { rest } from 'msw'
import { db } from '@db/pages/faq/db'
import type { FaqCategory } from '@db/pages/faq/types'

export const handlerPagesFaq = [
  rest.get(('/api/pages/faq'), (req, res, ctx) => {
    const q = req.url.searchParams.get('q') ?? ''

    const searchQuery = is.string(q) ? q : undefined
    const queryLowered = (searchQuery ?? '').toString().toLowerCase()

    const filteredData: FaqCategory[] = []

    Object.entries(db.faqs).forEach(([_, faqObj]) => {
      const filteredQAndA = faqObj.faqs.filter(obj => {
        return obj.question.toLowerCase().includes(queryLowered)
      })

      if (filteredQAndA.length)
        filteredData.push({ ...faqObj, faqs: filteredQAndA })
    })

    return res(
      ctx.status(200),
      ctx.json(filteredData),
    )
  }),

]
