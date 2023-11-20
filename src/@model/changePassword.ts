import { PasswordBaseField } from '../@model/baseField'
import i18n from '../libs/i18n'
import { UseEntityType } from '../components/templates/BaseSection/model'
import { ValidationRule } from '../@model/validations'

export class ChangePassword {
  readonly password: PasswordBaseField
  readonly repeatPassword: PasswordBaseField

  constructor() {
    this.password = new PasswordBaseField({
      key: 'password',
      label: i18n.t('placeholder.newPassword'),
      validationRules: ['required', 'password'],
      withPasswordGenerator: true,
      showPassword: true,
    })
    this.repeatPassword = new PasswordBaseField({
      key: 'repeatPassword',
      label: i18n.t('placeholder.repeatPassword'),
      validationRules: ['required', 'confirmed:password' as ValidationRule],
      showPassword: true,
    })
  }
}

export const useSection = (): UseEntityType<ChangePassword> => {
  const EntityFormClass = ChangePassword

  return {
    entityName: 'Password',
    EntityFormClass,
  }
}
