import { FieldInfo, FieldType } from '@model/field'
import i18n from '@/libs/i18n'

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
      label: i18n.t('auth.login') as string,
      placeholder: i18n.t('placeholder.login') as string,
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
