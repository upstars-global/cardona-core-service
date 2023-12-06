import { NumberOrString } from '../../../@model/index'

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
  const regExp: RegExp = /^\d+$/
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
  return +value[keyMin] <= +value[keyMax]
}

export const validatorListPhoneAndDomain = (value: Array<unknown>) => {
  if (!value.length) return true
  return value.every(({ phone, country }) => validatorPhone(phone) && country)
}
