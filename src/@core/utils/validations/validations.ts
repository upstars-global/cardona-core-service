import { extend, localize, configure } from 'vee-validate'
import i18n from '../../../libs/i18n'
import {
  required as rule_required,
  email as rule_email,
  min as rule_min,
  min_value as rule_min_value,
  max_value as rule_max_value,
  confirmed as rule_confirmed,
  regex as rule_regex,
  between as rule_between,
  alpha as rule_alpha,
  integer as rule_integer,
  digits as rule_digits,
  alpha_dash as rule_alpha_dash,
  alpha_num as rule_alpha_num,
  length as rule_length,
} from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'
import ru from 'vee-validate/dist/locale/ru.json'

// eslint-disable-next-line object-curly-newline
import {
  validatorPositive,
  validatorUrlValidator,
  validatorPassword,
  validatorCreditCard,
  validatorPhone,
  validatorObject,
  validatorRange,
  validatorListPhoneAndDomain,
  validatorDateISO8601,
  rangeDate,
  dateRangeDifferent,
} from './validators'

// ////////////////////////////////////////////////////////
// General
// ////////////////////////////////////////////////////////

// export const required = extend('required', rule_required)
export const required = extend('required', {
  ...rule_required,
  message: (_, values) => i18n.t('validations.required', values) as any,
})

export const email = extend('email', {
  ...rule_email,
  message: (_, values) => i18n.t('validations.email', values) as any,
})

export const min = extend('min', {
  ...rule_min,
  message: (_, values) => i18n.t('validations.min', values) as any,
})

export const minValue = extend('minValue', {
  ...rule_min_value,
  message: (_, values) => i18n.t('validations.min_value', values) as any,
})

export const maxValue = extend('maxValue', {
  ...rule_max_value,
  message: (_, values) => i18n.t('validations.max_value', values) as any,
})

export const confirmed = extend('confirmed', {
  ...rule_confirmed,
  message: (_, values) => i18n.t('validations.confirmed', values) as any,
})

export const regex = extend('regex', rule_regex)

export const between = extend('between', rule_between)

export const alpha = extend('alpha', rule_alpha)

export const integer = extend('integer', rule_integer)

export const digits = extend('digits', rule_digits)

export const alphaDash = extend('alpha-dash', rule_alpha_dash)

export const alphaNum = extend('alpha-num', rule_alpha_num)

export const length = extend('length', rule_length)

export const positive = extend('positive', {
  validate: validatorPositive,
  message: 'Please enter positive number!',
})

export const phone = extend('phone', {
  validate: validatorPhone,
  message: (_, values) => i18n.t('validations.phone', values) as any,
})

export const credit = extend('credit-card', {
  validate: validatorCreditCard,
  message: 'It is not valid credit card!',
})

export const password = extend('password', {
  validate: validatorPassword,
  message: (_, values) => i18n.t('validations.password', values) as any,
})

export const url = extend('url', {
  validate: validatorUrlValidator,
  message: 'URL is invalid',
})

export const required_object = extend('required_object', {
  validate: validatorObject,
  message: (_, values) => i18n.t('validations.required_object', values) as any,
})

export const range = extend('range', {
  validate: validatorRange,
  message: (_, { _field_, _value_, ...otherFields }) => {
    return i18n.t('validations.range', {
      _field_,
      labelTo: otherFields[1],
      valueFrom: _value_.from,
    }) as any
  },
})

export const phone_and_domain_list = extend('phone_and_domain_list', {
  validate: validatorListPhoneAndDomain,
  message: i18n.t('validations.invalidList') as any,
})

export const date_YYYY_MM_DD = extend('date_YYYY_MM_DD', {
  validate: validatorDateISO8601,
  message: (_, values) => i18n.t('validations.dateISO8601', values) as any,
})

export const range_date = extend('range_date', {
  validate: rangeDate,
  message: i18n.t('validations.dateRange') as any,
})

export const range_date_different = extend('range_date_different', {
  validate: dateRangeDifferent,
  message: i18n.t('validations.dateRangeDifferent') as any,
})

configure(
  localize({
    en: {
      messages: en.messages,
    },
    ru: {
      messages: ru.messages,
    },
  }) as any
)

// ////////////////////////////////////////////////////////
// NOTE:
// Quasar validation for reference only
// Remove this note once development is finished and make sure to
// to convert all of them in veevalidate version
// ////////////////////////////////////////////////////////

// export const required = (val) => {
//   return (val && val.isNotEmpty) || '*Field is required'
// }

// export const required_obj = (obj) => {
//   if (obj === null || obj === undefined) return '*Field is required'
//   return (Object.entries(obj).isNotEmpty && obj.constructor === Object) || '*Field is required'
// }

// export const no_blank_spaces_arr = (arr) => {
//   return arr.every(val => (val.trim() && val.trim().isNotEmpty)) || 'Blank Spaces are not allowed'
// }

// export const url = val => {
//   // If blank return
//   if (val === undefined || val === null || val.isEmpty) return true

//   // Used
//   // https://stackoverflow.com/questions/4314741/url-regex-validation

//   // Other
//   // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
//   // https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
//   // https://www.geeksforgeeks.org/how-to-validate-url-using-regular-expression-in-javascript/

//   /* eslint-disable no-useless-escape */
//   const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
//   /* eslint-enable no-useless-escape */
//   return re.test(val) || 'URL is invalid'
// }

// export const date = val => {

//   // If blank return
//   if (val === undefined || val === null || val.isEmpty) return true

//   // https://github.com/quasarframework/quasar/blob/dev/ui/src/utils/patterns.js
//   return /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(val) || 'Date is invalid'
// }

// export const max = (val, max) => {

//   // If blank return
//   if (val === undefined || val === null) return true

//   return val.length <= max || `More than ${max} characters are not allowed`
// }

// export const max_arr = (val, max) => {
//   return val.length <= max || `More than ${max} values are not allowed`
// }

// export const min = (val, min) => {

//   // If blank return
//   if (val === undefined || val === null || val.isEmpty) return true

//   return val.length >= min || `Minimum ${min} characters are required`
// }

// export const num_range = (val, min, max) => {

//   // If blank return
//   if (val === undefined || val === null || val.isEmpty) return true

//   const msg = 'Value is invalid'
//   if (min === null) return val <= max || msg
//   else if (max === null) return val >= min || msg
//   else return (val >= min && val <= max) || msg
// }
