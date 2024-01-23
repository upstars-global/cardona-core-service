import { PasswordBaseField, TextBaseField } from './templates/baseField'
import { i18n } from '@/plugins/i18n'

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
      validationRules: { required: true },
    })

    this.password = new PasswordBaseField({
      key: 'password',
      label: i18n.t('common.password'),
      placeholder: i18n.t('placeholder.password'),
      validationRules: { required: true },
    })
  }
}
