import { i18n } from '../plugins/i18n'
import { FieldInfo, FieldType } from './field'

export interface ILoginData {
  login: string
  password: string
}

export class LoginForm {
  readonly login: FieldInfo<string>
  readonly password: FieldInfo<string>

  constructor() {
    this.login = new FieldInfo({
      type: FieldType.Text,
      key: 'login',
      value: '',
      label: i18n.t('auth.login'),
      placeholder: i18n.t('placeholder.login'),
      validationRules: 'required',
    })

    this.password = new FieldInfo({
      type: FieldType.Password,
      key: 'password',
      value: '',
      label: i18n.t('common.password') as string,
      placeholder: i18n.t('placeholder.password') as string,
      validationRules: 'required',
    })
  }
}
