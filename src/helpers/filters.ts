import { i18n } from '../plugins/i18n'
import { getLocaleDateString, transformDateToISO } from '../helpers/date'
import { dateSeparators } from '../@model/date'

export const formatPhone = (phone: string) => {
  const mask = '1 111 111 11 11'
  let phoneArr = String(Number(phone)).trim().split('')
  let i = 0
  phoneArr = phoneArr.map(item => {
    if (mask[i] === '1') {
      i++

      return item
    }
    else {
      i += 2

      return ` ${item}`
    }
  })

  return `+${phoneArr.join('')}`
}

export const parseDateRange = (dateFilter: string): Array<string> =>
  dateFilter.split(dateSeparators[i18n.locale]).map(transformDateToISO)

export const parseInputDateRange = (from: Date, to: Date, locale = 'uk'): string => `
    ${getLocaleDateString(from, locale)} 
    ${dateSeparators[i18n.locale]} 
    ${getLocaleDateString(to, locale)}
    `

