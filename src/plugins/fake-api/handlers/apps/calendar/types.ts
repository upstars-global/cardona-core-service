export interface CalendarEvent {
  id: number
  url: string
  title: string
  start: Date | string
  end: Date | string
  allDay: boolean
  extendedProps: Record<string, any>
}
