import is from '@sindresorhus/is'
import destr from 'destr'
import { rest } from 'msw'
import { db } from '@db/apps/calendar/db'
import { genId } from '@api-utils/genId'

export const handlerAppsCalendar = [

  // 👉 Get Calendar Events
  rest.get(('/api/apps/calendar'), (req, res, ctx) => {
    const queries = req.url.searchParams.getAll('calendars')

    const parsedCalendars = destr(queries)

    const calendars = is.array(parsedCalendars) ? parsedCalendars : undefined

    const events = db.events.filter(event => calendars?.includes(event.extendedProps.calendar))

    return res(
      ctx.status(200),
      ctx.json(events),
    )
  }),

  // 👉 Add Calendar Event
  rest.post(('/api/apps/calendar'), async (req, res, ctx) => {
    const event = await req.json() as typeof db.events[0]

    db.events.push({
      ...event,
      id: genId(db.events),
    })

    return res(
      ctx.status(200),
      ctx.json(event),
    )
  }),

  // 👉 Update Calendar Event
  rest.put(('/api/apps/calendar/:id'), async (req, res, ctx) => {
    const updatedEvent = await req.json() as typeof db.events[0]

    updatedEvent.id = Number(updatedEvent.id)

    const eventId = Number(req.params.id)

    // Find the index of the event in the database
    const currentEvent = db.events.find(e => e.id === eventId)

    // update event
    if (currentEvent) {
      Object.assign(currentEvent, updatedEvent)

      return res(
        ctx.status(200),
        ctx.json(currentEvent),
      )
    }

    return res(
      ctx.status(400),
      ctx.json({ message: 'Something Went Wrong' }),
    )
  }),

  // 👉 Delete Calendar Event
  rest.delete(('/api/apps/calendar/:id'), (req, res, ctx) => {
    const eventId = Number(req.params.id)

    const eventIndex = db.events.findIndex(e => e.id === eventId)

    if (eventIndex !== -1) {
      db.events.splice(eventIndex, 1)

      return res(
        ctx.status(204),
      )
    }

    return res(
      ctx.status(400),
      ctx.json({ message: 'Something Went Wrong' }),
    )
  }),
]
