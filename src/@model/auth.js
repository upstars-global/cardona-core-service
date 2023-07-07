import { FieldInfo, FieldType } from '../@model/field';
import i18n from '../libs/i18n';
export class LoginForm {
    login;
    password;
    constructor() {
        this.login = new FieldInfo({
            type: FieldType.Text,
            key: 'login',
            value: '',
            label: i18n.t('auth.login'),
            placeholder: i18n.t('placeholder.login'),
            validationRules: 'required',
        });
        this.password = new FieldInfo({
            type: FieldType.Password,
            key: 'password',
            value: '',
            label: i18n.t('common.password'),
            placeholder: i18n.t('placeholder.password'),
            validationRules: 'required',
        });
    }
}
//# sourceMappingURL=auth.js.map