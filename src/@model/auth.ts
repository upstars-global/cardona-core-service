import { i18n } from '../plugins/i18n'
import {PasswordBaseField, TextBaseField} from "@/@model/templates/baseField";

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
