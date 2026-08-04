import moment from 'moment'
import type { Nullable } from '../@model/index'

/** Default date-time display format used across the app. */
export const BASE_FORMAT = 'DD.MM.YYYY, HH:mm'

/**
 * Normalises a date-range string so both parts use `BASE_FORMAT`.
 * If the input is already correctly formatted it is returned unchanged.
 *
 * @param date — raw date string, either a single date or a range separated by ` to `
 * @returns the original string if already valid, or both parts re-formatted and joined by ` to `
 *
 * @example
 * getDateRange('01.01.2024, 00:00 to 31.12.2024, 23:59') // → unchanged
 * getDateRange('2024-01-01 to 2024-12-31')               // → '01.01.2024, 00:00 to 31.12.2024, 00:00'
 */
export const getDateRange = (date: string) => {
  const dateRangeList = date.split('to').map(date => date.trim())
  const isValidDate = dateRangeList.every(date => moment(date, BASE_FORMAT, true).isValid())

  if (isValidDate)
    return date

  return dateRangeList.map((date: string) => moment(date).format(BASE_FORMAT)).join(' to ')
}

/**
 * Formats a date string using `BASE_FORMAT`, falling back to the current date-time if the input is invalid.
 *
 * @param dateString — date string to parse, expected in `BASE_FORMAT`
 * @returns the re-formatted date string, or the current date-time when `dateString` cannot be parsed
 *
 * @example
 * formatDate('27.07.2026, 14:00') // → '27.07.2026, 14:00'
 * formatDate('garbage')           // → current date-time in BASE_FORMAT
 */
export const formatDate = (dateString: string): string => {
  const parsedDate = moment(dateString, BASE_FORMAT)

  if (parsedDate.isValid())
    return parsedDate.format(BASE_FORMAT)

  else
    return moment().format(BASE_FORMAT)
}

/**
 * Converts a date value to a UTC ISO string by stripping any timezone offset.
 *
 * @param isoString — ISO date string or Date object to normalise
 * @returns UTC ISO 8601 string, or an empty string when `isoString` is falsy
 *
 * @example
 * getISOStringWithoutTimezone('2024-01-01T12:00:00+03:00') // → '2024-01-01T09:00:00.000Z'
 */
export const getISOStringWithoutTimezone = (isoString: string | Date): string => {
  if (!isoString)
    return ''

  const utcStringWithoutTimezone: string = new Date(isoString).toUTCString().replace('GMT', '')

  return new Date(utcStringWithoutTimezone).toISOString()
}

/** Returns a `Date` set to the start of the current local day (00:00:00.000). */
export const getStartOfDayDate = (): Date => new Date(new Date().setHours(0, 0, 0, 0))

/**
 * Tests whether a value matches the ISO 8601 date-time format (`YYYY-MM-DDTHH:mm:ss[.sss][Z]`).
 *
 * @param dateString — value to test
 * @returns `true` when the value matches the ISO date-time pattern
 *
 * @example
 * isISODate('2024-01-01T00:00:00Z')     // → true
 * isISODate('2024-01-01T00:00:00.000Z') // → true
 * isISODate('01.01.2024, 00:00')        // → false
 */
export const isISODate = (dateString: string | Date): boolean => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/

  return isoRegex.test(dateString.toString())
}

/**
 * Formats a `Date` as a locale-aware string with date, hour, and minute.
 *
 * @param date — the date to format
 * @param language — BCP 47 language tag for locale formatting (defaults to `'uk'`)
 * @returns locale-formatted date-time string, e.g. `'01.01.2024, 00:00'`
 *
 * @example
 * getLocaleDateString(new Date('2024-01-01T00:00:00'), 'uk') // → '01.01.2024, 00:00'
 * getLocaleDateString(new Date('2024-06-15T09:30:00'), 'en') // → '6/15/2024, 09:30 AM'
 */
export const getLocaleDateString = (date: Date, language = 'uk'): string => {
  return date.toLocaleDateString(language, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Converts an ISO string to a locale-formatted date string after stripping the timezone offset.
 *
 * @param isoString — ISO date string to format
 * @returns locale-formatted date-time string (Ukrainian locale) derived from the UTC time of the input
 *
 * @example
 * getLocaleDateStringWithoutTimezone('2024-01-01T12:00:00+03:00') // → '01.01.2024, 09:00'
 */
export const getLocaleDateStringWithoutTimezone = (isoString: string): string => {
  const utcStringWithoutTimezone: string = new Date(isoString).toUTCString().replace('GMT', '')
  const date = new Date(utcStringWithoutTimezone)

  return getLocaleDateString(date)
}

/**
 * Converts a date value to a UTC ISO string via its locale string representation.
 *
 * @param dateString — date string or Date object to convert
 * @returns UTC ISO 8601 string; returns the input coerced to string when falsy
 *
 * @example
 * getUTCISOString('2024-06-15T09:30:00.000Z') // → '2024-06-15T09:30:00.000Z'
 * getUTCISOString(new Date('2024-06-15'))      // → '2024-06-15T00:00:00.000Z'
 */
export const getUTCISOString = (dateString: string | Date): string => {
  if (!dateString)
    return dateString.toString()
  const localeDateString: string = getLocaleDateString(new Date(dateString))

  return transformDateToISO(localeDateString)
}

/**
 * Converts a date string in `DD.MM.YYYY, HH:mm` format to a UTC ISO 8601 string.
 *
 * @param dateString — date string in `DD.MM.YYYY, HH:mm` format
 * @returns UTC ISO 8601 string representing the same date and time
 *
 * @example
 * transformDateToISO('27.07.2026, 14:30') // → '2026-07-27T14:30:00.000Z'
 */
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

/**
 * Creates a new `Date` whose local time components equal the UTC components of the input.
 *
 * Useful when a UTC timestamp must be displayed without any timezone shift.
 *
 * @param date — source date to extract UTC components from
 * @returns a new Date whose `getHours()`/`getMinutes()`/… match `date`'s UTC equivalents
 *
 * @example
 * // UTC noon stored as Date — local machine shows 15:00 in UTC+3
 * const d = convertDateToUTC(new Date('2024-01-01T12:00:00Z'))
 * d.getHours()   // → 12  (matches UTC, regardless of local timezone)
 * d.getMinutes() // → 0
 */
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

/**
 * Sorts an array of items by a date field in descending order (newest first).
 *
 * @param list — array of items to sort; non-array input returns an empty array
 * @param key — property name to read the date from; pass an empty string to treat each item as a date value directly
 * @returns the sorted array (newest first), or `[]` when `list` is not an array
 *
 * @example
 * const items = [{ date: '2024-01-01' }, { date: '2024-12-31' }]
 * sortListByDate(items, 'date') // → [{ date: '2024-12-31' }, { date: '2024-01-01' }]
 *
 * sortListByDate(['2024-01-01', '2024-12-31'], '') // → ['2024-12-31', '2024-01-01']
 */
export const sortListByDate = (list: Array<any>, key: string): Array<any> => {
  if (!Array.isArray(list))
    return []

  return list.sort((next, prev) => {
    const nextDate = new Date(key ? next[key] : next).getTime()
    const prevDate = new Date(key ? prev[key] : prev).getTime()

    return prevDate - nextDate
  })
}

/**
 * Converts an `HH:mm` time string to an ISO 8601 string using today's date with that UTC time.
 *
 * @param timeString — time in `HH:mm` format
 * @returns ISO 8601 string with today's date and the given hours/minutes set in UTC
 *
 * @example
 * serializeTimeToISO('14:30') // → '2026-07-27T14:30:00.000Z' (current date)
 */
export const serializeTimeToISO = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':')
  const currentDate = new Date()

  currentDate.setUTCHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0)

  return currentDate.toISOString()
}

/**
 * Extracts the `HH:mm` portion from an ISO date string.
 *
 * @param date — nullable ISO date string; returns an empty string when falsy
 * @returns time in `HH:mm` format, or `''` when `date` is absent
 *
 * @example
 * getTimeFromDate('2026-07-27T14:30:00.000Z') // → '14:30'
 * getTimeFromDate(null)                         // → ''
 */
export const getTimeFromDate = (date: Nullable<string> | undefined): string => {
  if (!date)
    return ''

  return new Date(date).toISOString().slice(11, 16)
}

/** Returns a `Date` set to 23:59:00.000 in the current local day. */
export const getEndOfDay = () => {
  const now = new Date()

  now.setHours(23, 59, 0, 0)

  return now
}

/**
 * Re-formats an ISO string as `YYYY-MM-DDTHH:mm:ss+00:00`, preserving the UTC time.
 *
 * @param isoDateString — ISO date string to reformat
 * @returns date string in `YYYY-MM-DDTHH:mm:ss+00:00` format
 *
 * @example
 * formatToISOWithTimeZone('2024-09-14T00:00:00.000Z') // → '2024-09-14T00:00:00+00:00'
 */
export const formatToISOWithTimeZone = (isoDateString: string): string => {
  return moment(isoDateString).format('YYYY-MM-DDTHH:mm:ss+00:00')
}

/**
 * Converts a duration in minutes to a compact human-readable string.
 *
 * Zero-value units are omitted; returns `'0m'` for a zero-minute input.
 *
 * @param minutes — total number of minutes to format
 * @returns formatted duration string, e.g. `'1d 2h 30m'`, `'45m'`, or `'0m'`
 *
 * @example
 * minutesToHumanReadable(90)   // → '1h 30m'
 * minutesToHumanReadable(1500) // → '1d 1h'
 * minutesToHumanReadable(0)    // → '0m'
 */
export const minutesToHumanReadable = minutes => {
  const { days, hours, minutes: mins } = moment.duration(minutes, 'minutes')._data

  return [`${days}d`, `${hours}h`, `${mins}m`]
    .filter(part => !part.startsWith('0'))
    .join(' ') || '0m'
}
