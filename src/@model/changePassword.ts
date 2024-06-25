import { i18n } from '../plugins/i18n'
import type { UseEntityType } from './templates/baseSection'
import { PasswordBaseField } from './templates/baseField'

export class ChangePassword {
  readonly password: PasswordBaseField
  readonly repeatPassword: PasswordBaseField

  constructor() {
    this.password = new PasswordBaseField({
      key: 'password',
      label: i18n.t('placeholder.newPassword'),
      validationRules: { required: true, password: true },
      withPasswordGenerator: true,
      showPassword: true,
    })
    this.repeatPassword = new PasswordBaseField({
      key: 'repeatPassword',
      label: i18n.t('placeholder.repeatPassword'),
      validationRules: { required: true, confirmed: '@password' },
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
