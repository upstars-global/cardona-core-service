import { NumberOrString } from '../../../@model/index'
import { PhoneAndCountry } from '../../../@model/demo'
import { dateSeparators } from '../../../@model/date'
import i18n from '../../../libs/i18n'

export const validatorPositive = (value) => {
  if (value >= 0) {
    return true
  }
  return false
}

export const validatorPassword = (password) => {
  /* eslint-disable no-useless-escape */
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
  /* eslint-enable no-useless-escape */
  const validPassword = regExp.test(password)
  return validPassword
}

export const validatorCreditCard = (creditnum) => {
  /* eslint-disable no-useless-escape */
  const cRegExp = /^(?:3[47][0-9]{13})$/
  /* eslint-enable no-useless-escape */
  const validCreditCard = cRegExp.test(creditnum)
  return validCreditCard
}

export const validatorUrlValidator = (val) => {
  if (val === undefined || val === null || val.isEmpty) {
    return true
  }
  /* eslint-disable no-useless-escape */
  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
  /* eslint-enable no-useless-escape */
  return re.test(val)
}

export const validatorPhone = (value: string): boolean => {
  const regExp = /^\d+$/
  const phoneWithoutPlus: string = value.replace('+', '')

  return regExp.test(phoneWithoutPlus)
}

export const validatorObject = (value: Record<string, NumberOrString>): boolean => {
  if (value === null || value === undefined) return false
  return Object.values(value).every(Boolean)
}

export const validatorRange = (value: Record<string, NumberOrString>, args): boolean => {
  const [keyMin, keyMax] = args as Array<NumberOrString>
  if (!validatorObject(value)) return false
  return +value[keyMin] < +value[keyMax]
}

export const validatorListPhoneAndDomain = (value: Array<PhoneAndCountry>): boolean => {
  if (!value.length) return true
  return value.every(({ phone, country }) => validatorPhone(phone) && country)
}

export const validatorDateISO8601 = (dateString: string): boolean => {
  const dateRegExp = /^\d{4}-\d{2}-\d{2}$/

  return dateRegExp.test(dateString)
}

export const rangeDate = (dateDiapason: string, args): boolean => {
  const [separator = dateSeparators[i18n.locale]] = args as Array<string>
  const dates = dateDiapason.split(separator).map((date) => date.trim())
  return dates.length === 2 && dates.every(Boolean)
}

export const dateRangeDifferent = (dateDiapason: string, args): boolean => {
  const [separator = dateSeparators[i18n.locale]] = args as Array<string>
  const [from, to] = dateDiapason.split(separator).map((date) => date.trim())
  return from !== to
}
