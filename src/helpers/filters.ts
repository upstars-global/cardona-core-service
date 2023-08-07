import i18n from '../libs/i18n'
import { getLocaleDateString, transformDateToISO } from '../helpers/date'

export const formatPhone = (phone) => {
  const mask = '1 111 111 11 11'
  let phoneArr = String(Number(phone)).trim().split('')
  let i = 0
  phoneArr = phoneArr.map((item) => {
    if (mask[i] === '1') {
      i++
      return item
    } else {
      i += 2
      return ' ' + item
    }
  })
  return '+' + phoneArr.join('')
}

export const parseDateRange = (dateFilter: string): Array<string> => {
  const dateSeparators: { en: string; ru: string } = {
    en: 'to',
    ru: '—',
  }

  return dateFilter.split(dateSeparators[i18n.locale]).map(transformDateToISO)
}
export const parseInputDateRange = (from: Date, to: Date, locale = 'uk'): string => {
  const dateSeparators: { en: string; ru: string } = {
    en: 'to',
    ru: '—',
  }

  return `
    ${getLocaleDateString(from, locale)} 
    ${dateSeparators[i18n.locale]} 
    ${getLocaleDateString(to, locale)}
    `
}
