import type { Except } from 'type-fest'
import type { CalendarEvent } from '@/plugins/fake-api/handlers/apps/calendar/types'

export interface Event extends CalendarEvent {
  extendedProps: {
    calendar?: string
    location: string
    description: string
    guests: string[]
  }
}

export type NewEvent = Except<Event, 'id'>
