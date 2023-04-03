import { FieldInfo, FieldType } from '../@model/field'
import i18n from '../libs/i18n'
import { UseEntityType } from '../components/templates/BaseSection/model'

export class ChangePassword {
  readonly password?: FieldInfo<string>
  readonly repeatPassword: FieldInfo<string>

  constructor() {
    this.password = new FieldInfo<string>({
      type: FieldType.Password,
      key: 'password',
      value: '',
      label: i18n.t('placeholder.newPassword'),
      validationRules: 'required|password',
    })
    this.repeatPassword = new FieldInfo<string>({
      type: FieldType.Password,
      key: 'repeatPassword',
      value: '',
      label: i18n.t('placeholder.repeatPassword'),
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
