import { FieldInfo, FieldType } from '../@model/field'
import { t } from '../plugins/i18n'
import type { UseEntityType } from '../@model/templates/baseSection'

export class ChangePassword {
  readonly password?: FieldInfo<string>
  readonly repeatPassword: FieldInfo<string>

  constructor() {
    this.password = new FieldInfo<string>({
      type: FieldType.Password,
      key: 'password',
      value: '',
      label: t('placeholder.newPassword'),
      validationRules: 'required|password',
    })
    this.repeatPassword = new FieldInfo<string>({
      type: FieldType.Password,
      key: 'repeatPassword',
      value: '',
      label: t('placeholder.repeatPassword'),
      validationRules: 'required|confirmed:password',
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
