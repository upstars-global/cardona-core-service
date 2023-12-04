import { configure, defineRule } from 'vee-validate'
import {
  alpha,
  alpha_dash,
  alpha_num,
  between,
  confirmed,
  digits,
  email,
  integer,
  length,
  max_value,
  min,
  min_value,
  regex,
  required,
} from '@vee-validate/rules'
import type { FieldValidationMetaInfo } from '@vee-validate/i18n'
import { i18n } from '../plugins/i18n'
import type { NumberOrString } from '../@model/index'

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('min_value', min_value)
defineRule('max_value', max_value)
defineRule('confirmed', confirmed)
defineRule('regex', regex)
defineRule('between', between)
defineRule('alpha', alpha)
defineRule('integer', integer)
defineRule('digits', digits)
defineRule('alpha_dash', alpha_dash)
defineRule('alpha_num', alpha_num)
defineRule('length', length)

const validatorPositive = (value: number): boolean => {
  return value >= 0
}

const validatorPassword = (password: string): boolean => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  return regExp.test(password)
}

const validatorCreditCard = (creditnum: string): boolean => {
  const cRegExp = /^(?:3[47][0-9]{13})$/

  return cRegExp.test(creditnum)
}

const validatorUrlValidator = (val: string): boolean => {
  if (val === undefined || val === null || val.isEmpty)
    return true

  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  return re.test(val)
}

const validatorPhone = (value: string): boolean => {
  const regExp: RegExp = /^\d+$/
  const phoneWithoutPlus: string = value.replace('+', '')

  return regExp.test(phoneWithoutPlus)
}

const validatorObject = (value: Record<string, NumberOrString>): boolean => {
  if (value === null || value === undefined)
    return false

  return Object.values(value).every(Boolean)
}

const validatorRange = (value: Record<string, NumberOrString>, args: []): boolean => {
  const [keyMin, keyMax] = args as Array<NumberOrString>
  if (!validatorObject(value))
    return false

  return +value[keyMin] <= +value[keyMax]
}

defineRule('positive', validatorPositive)
defineRule('password', validatorPassword)
defineRule('creditCard', validatorCreditCard)
defineRule('url', validatorUrlValidator)
defineRule('phone', validatorPhone)
defineRule('required_object', validatorObject)
defineRule('range', validatorRange)

export interface IValidationConfig {
  required?: boolean
  email?: boolean
  min?: number
  min_value?: number
  max_value?: number
  confirmed?: boolean
  regex?: RegExp
  between?: { min: number; max: number }
  alpha?: boolean
  integer?: boolean
  digits?: number
  alpha_dash?: boolean
  alpha_num?: boolean
  length?: number
  positive?: boolean
  phone?: boolean
  creditCard?: boolean
  password?: boolean
  url?: boolean
  required_object?: Record<string, NumberOrString>
  range?: boolean
}
(function () {
  configure({
    generateMessage: (ctx: FieldValidationMetaInfo) => {
      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label })
    },
  })
})()
