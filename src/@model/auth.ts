import i18n from '../libs/i18n'
import { TextBaseField, PasswordBaseField } from '../@model/baseField'

export interface ILoginData {
  login: string
  password: string
}

export class LoginForm {
  readonly login: TextBaseField
  readonly password: PasswordBaseField

  constructor() {
    this.login = new TextBaseField({
      key: 'login',
      label: i18n.t('auth.login'),
      placeholder: i18n.t('placeholder.login'),
      validationRules: 'required',
    })

    this.password = new PasswordBaseField({
      key: 'password',
      label: i18n.t('common.password'),
      placeholder: i18n.t('placeholder.password'),
      validationRules: 'required',
    })
  }
}
