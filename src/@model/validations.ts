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
  max,
  max_value,
  min,
  min_value,
  regex,
  required,
} from '@vee-validate/rules'
import type { FieldValidationMetaInfo } from '@vee-validate/i18n'
import { has } from 'lodash'
import type { TranslateResult } from 'vue-i18n'
import moment from 'moment'
import { i18n } from '../plugins/i18n'
import type { NumberOrString } from '../@model/index'
import { dateSeparators } from '../@model/date'

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('max', max)
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

const customMessageOfRules: Record<
  Partial<keyof IValidationConfig>,
  (ctx: FieldValidationMetaInfo) => TranslateResult> = {
    max(ctx: FieldValidationMetaInfo): TranslateResult {
      const _length_ = ctx.rule.params.at(0)

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label, _length_ })
    },
    min(ctx: FieldValidationMetaInfo): TranslateResult {
      const _length_ = ctx.rule.params.at(0)

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label, _length_ })
    },
    length(ctx: FieldValidationMetaInfo): TranslateResult {
      const _length_ = ctx.rule.params.at(0)

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label, _length_ })
    },
    min_value(ctx: FieldValidationMetaInfo): TranslateResult {
      const _min_ = ctx.rule.params.at(0)

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label, _min_ })
    },
    max_value(ctx: FieldValidationMetaInfo): TranslateResult {
      const _max_ = ctx.rule.params.at(0)

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label, _max_ })
    },
    between(ctx: FieldValidationMetaInfo): TranslateResult {
      const _min_ = ctx.rule.params.min
      const _max_ = ctx.rule.params.max

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label, _min_, _max_ })
    },
    range(ctx: FieldValidationMetaInfo): TranslateResult {
      const [keyFrom, keyTo] = ctx.rule?.params
      const valueFrom = ctx.form[ctx.name][keyFrom]

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label, valueFrom, labelTo: keyTo })
    },
    date_format(ctx: FieldValidationMetaInfo): TranslateResult {
      const format = ctx.rule?.params[0].replace(/_/g, '-')

      return i18n.t(`validations.${ctx.rule?.name}`, { format })
    },
  }

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
  const regExp = /^\d+$/
  const phoneWithoutPlus: string = value.replace('+', '')

  return regExp.test(phoneWithoutPlus)
}

const validatorObject = (value: Record<string, NumberOrString>): boolean => {
  if (value === null || value === undefined)
    return false

  const values = Object.values(value)
  const isNotEmpty = values.every((item: number | string) => item || item?.toString()?.length)

  return isNotEmpty && values.map(Number).some(Boolean)
}

const validatorRange = (value: Record<string, NumberOrString>, args: []): boolean => {
  const [keyMin, keyMax] = args as Array<NumberOrString>
  if (!validatorObject(value))
    return false

  return +value[keyMin] < +value[keyMax]
}

export const rangeDate = (dateDiapason: string, args: string[]): boolean => {
  if (!dateDiapason)
    return true

  const [separator = dateSeparators[i18n.locale.value]] = args
  const dates = dateDiapason.split(separator).map(date => date.trim())

  return dates.length === 2 && dates.every(Boolean)
}

export const dateRangeDifferent = (dateDiapason: string, args: string[]): boolean => {
  if (!dateDiapason)
    return true

  const [separator = dateSeparators[i18n.locale.value]] = args
  const [from, to] = dateDiapason.split(separator).map(date => date.trim())

  return moment(from).valueOf() !== moment(to).valueOf()
}

export const date_format = (value: string, args: string[]) => {
  if (!value)
    return true

  let [format] = args

  if (!format)
    format = 'YYYY_MM_DD'

  return moment(value, format).isValid()
}

defineRule('positive', validatorPositive)
defineRule('password', validatorPassword)
defineRule('creditCard', validatorCreditCard)
defineRule('url', validatorUrlValidator)
defineRule('phone', validatorPhone)
defineRule('required_object', validatorObject)
defineRule('range', validatorRange)
defineRule('range_date', rangeDate)
defineRule('range_date_different', dateRangeDifferent)
defineRule('date_format', date_format)

export interface IValidationConfig {
  required?: boolean
  email?: boolean
  min?: number
  max?: number
  min_value?: number
  max_value?: number
  confirmed?: string
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
  required_object?: boolean
  range?: Array<string>
  range_date?: boolean | string
  range_date_different?: boolean | string
  date_format?: string
}
(function () {
  configure({
    generateMessage: (ctx: FieldValidationMetaInfo) => {
      if (has(customMessageOfRules, ctx.rule?.name))
        return customMessageOfRules[ctx.rule?.name](ctx)

      return i18n.t(`validations.${ctx.rule?.name}`, { _field_: ctx.label })
    },
  })
})()
