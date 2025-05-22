export const dateFormat = (
  date: Date,
  options?: Intl.DateTimeFormatOptions,
  locales = 'uk',
): string => {
  if (!date?.toLocaleDateString)
    return ''

  return date.toLocaleDateString(locales, { ...options, timeZone: 'UTC' })
}

export const dayDate = (date: Date): string => {
  return dateFormat(date)
}

export const fullDate = (date: Date): string => {
  return dateFormat(date, { hour: '2-digit', minute: '2-digit' })
}

export const fullDateWithSeconds = (date: Date): string => {
  return dateFormat(date, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
