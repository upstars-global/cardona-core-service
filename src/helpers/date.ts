import moment from 'moment'
import type { Nullable } from '../@model/index'

export const BASE_FORMAT = 'DD.MM.YYYY, HH:mm'

export const getDateRange = (date: string) => {
  const dateRangeList = date.split('to').map(date => date.trim())
  const isValidDate = dateRangeList.every(date => moment(date, BASE_FORMAT, true).isValid())

  if (isValidDate)
    return date

  return dateRangeList.map((date: string) => moment(date).format(BASE_FORMAT)).join(' to ')
}

export const formatDate = (dateString: string): string => {
  const parsedDate = moment(dateString, BASE_FORMAT)

  if (parsedDate.isValid())
    return parsedDate.format(BASE_FORMAT)

  else
    return moment().format(BASE_FORMAT)
}

export const getISOStringWithoutTimezone = (isoString: string | Date): string => {
  if (!isoString)
    return ''

  const utcStringWithoutTimezone: string = new Date(isoString).toUTCString().replace('GMT', '')

  return new Date(utcStringWithoutTimezone).toISOString()
}

export const isISODate = (dateString: string | Date): boolean => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/

  return isoRegex.test(dateString.toString())
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
  if (!dateString)
    return dateString.toString()
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
    date.getUTCSeconds(),
  )
}

export const sortListByDate = (list: Array<any>, key: string): Array<any> => {
  if (!Array.isArray(list))
    return []

  return list.sort((next, prev) => {
    const nextDate = new Date(key ? next[key] : next).getTime()
    const prevDate = new Date(key ? prev[key] : prev).getTime()

    return prevDate - nextDate
  })
}

export const serializeTimeToISO = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':')
  const currentDate = new Date()

  currentDate.setUTCHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0)

  return currentDate.toISOString()
}

export const getTimeFromDate = (date: Nullable<string> | undefined): string => {
  if (!date)
    return ''

  return new Date(date).toISOString().slice(11, 16)
}

export const getEndOfDay = () => {
  const now = new Date()

  now.setHours(23, 59, 0, 0)

  return now
}

// converts 2024-09-14T00:00:00.000Z => 2024-09-14T00:00:00+00:00
export const formatToISOWithTimeZone = (isoDateString: string): string => {
  return moment(isoDateString).format('YYYY-MM-DDTHH:mm:ss+00:00')
}

export const formatSecondsToHuman = seconds => {
  const { days, hours, minutes, seconds: secs } = moment.duration(seconds, 'seconds')._data

  return [`${days}d`, `${hours}h`, `${minutes}m`, `${secs}s`]
    .filter(part => !part.startsWith('0'))
    .join(' ') || '0s'
}
