export const getISOStringWithoutTimezone = (isoString: string): string => {
  const utcStringWithoutTimezone: string = new Date(isoString).toUTCString().replace('GMT', '')

  return new Date(utcStringWithoutTimezone).toISOString()
}

export const getLocaleDateString = (date: Date): string => {
  return date.toLocaleDateString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getLocaleDateStringWithoutTimezone = (isoString: string): string => {
  const utcStringWithoutTimezone: string = new Date(isoString).toUTCString().replace('GMT', '')
  const date = new Date(utcStringWithoutTimezone)

  return getLocaleDateString(date)
}

export const getUTCISOString = (dateString: string): string => {
  const localeDateString: string = getLocaleDateString(new Date(dateString))

  return transformDateToISO(localeDateString)
}

export const transformDateToISO = (dateString: string): string => {
  const pattern: RegExp = /(\d{2})\.(\d{2})\.(\d{4}),\s(\d{2}):(\d{2})/
  const replaceValue: string = '$3-$2-$1-$4-$5'

  const [year, month, day, hour, minute]: Array<number> = dateString
    .trim()
    .replace(pattern, replaceValue)
    .split('-')
    .map((dateStringItem: string): number => Number(dateStringItem))

  return new Date(Date.UTC(year, month - 1, day, hour, minute)).toISOString()
}
