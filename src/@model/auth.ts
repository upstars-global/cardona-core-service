import { t } from '../plugins/i18n'
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
      label: t('auth.login'),
      placeholder: t('placeholder.login'),
      validationRules: 'required',
    })

    this.password = new FieldInfo({
      type: FieldType.Password,
      key: 'password',
      value: '',
      label: t('common.password') as string,
      placeholder: t('placeholder.password') as string,
      validationRules: 'required',
    })
  }
}
