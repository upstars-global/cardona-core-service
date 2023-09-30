import type { Event, NewEvent } from './types'
import axios from '@axios'

export const useCalendarStore = defineStore('calendar', {
  // arrow function recommended for full type inference
  state: () => ({
    availableCalendars: [
      {
        color: 'error',
        label: 'Personal',
      },
      {
        color: 'primary',
        label: 'Business',
      },
      {
        color: 'warning',
        label: 'Family',
      },
      {
        color: 'success',
        label: 'Holiday',
      },
      {
        color: 'info',
        label: 'ETC',
      },
    ],
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC'],
  }),
  actions: {
    async fetchEvents() {
      return axios.get('/apps/calendar/events', { params: { calendars: this.selectedCalendars.join(',') } })
    },
    async addEvent(event: NewEvent) {
      return axios.post('/apps/calendar/events', { event })
    },
    async updateEvent(event: Event) {
      return axios.post(`/apps/calendar/events/${event.id}`, { event })
    },
    async removeEvent(eventId: string) {
      return axios.delete(`/apps/calendar/events/${eventId}`)
    },

  },
})
