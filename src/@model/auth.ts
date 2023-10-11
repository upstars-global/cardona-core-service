import { FieldInfo, FieldType } from '../@model/field'
import i18n from '../libs/i18n'
import { TextBaseField } from '../@model/baseField'

export interface ILoginData {
  login: string
  password: string
}

export class LoginForm {
  readonly login: TextBaseField
  readonly password: FieldInfo<string>

  constructor() {
    this.login = new TextBaseField({
      key: 'login',
      label: i18n.t('auth.login'),
      placeholder: i18n.t('placeholder.login'),
      validationRules: 'required',
    })

    this.password = new FieldInfo({
      type: FieldType.Password,
      key: 'password',
      value: '',
      label: i18n.t('common.password'),
      placeholder: i18n.t('placeholder.password'),
      validationRules: 'required',
    })
  }
}
