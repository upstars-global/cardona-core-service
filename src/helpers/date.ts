import { Nullable } from '../@model'

export const getISOStringWithoutTimezone = (isoString: string | Date): string => {
  if (!isoString) return ''

  const utcStringWithoutTimezone: string = new Date(isoString).toUTCString().replace('GMT', '')

  return new Date(utcStringWithoutTimezone).toISOString()
}

export const getLocaleDateString = (date: Date, language = 'uk'): string => {
  return date.toLocaleDateString(language, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getLocaleDateStringWithoutTimezone = (isoString: string): string => {
  const utcStringWithoutTimezone: string = new Date(isoString).toUTCString().replace('GMT', '')
  const date = new Date(utcStringWithoutTimezone)

  return getLocaleDateString(date)
}

export const getUTCISOString = (dateString: string | Date): string => {
  const localeDateString: string = getLocaleDateString(new Date(dateString))

  return transformDateToISO(localeDateString)
}

export const transformDateToISO = (dateString: string): string => {
  const pattern = /(\d{2})\.(\d{2})\.(\d{4}),\s(\d{2}):(\d{2})/
  const replaceValue = '$3-$2-$1-$4-$5'

  const [year, month, day, hour, minute]: Array<number> = dateString
    .trim()
    .replace(pattern, replaceValue)
    .split('-')
    .map((dateStringItem: string): number => Number(dateStringItem))

  return new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString()
}

export const convertDateToUTC = (date: Date): Date => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

export const sortListByDate = (list: Array<any>, key: string): Array<any> => {
  if (!Array.isArray(list)) return []
  return list.sort((next, prev) => {
    const nextDate = new Date(key ? next[key] : next).getTime()
    const prevDate = new Date(key ? prev[key] : prev).getTime()
    return prevDate - nextDate
  })
}

export const serializeTimeToISO = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':')
  const currentDate = new Date()
  currentDate.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
  return currentDate.toISOString()
}

export const getTimeFromDate = (date: Nullable<string> | undefined): string => {
  if (!date) return ''
  return new Date(date).toISOString().slice(11, 16)
}
