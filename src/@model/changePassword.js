import { FieldInfo, FieldType } from '../@model/field';
import i18n from '../libs/i18n';
export class ChangePassword {
    password;
    repeatPassword;
    constructor() {
        this.password = new FieldInfo({
            type: FieldType.Password,
            key: 'password',
            value: '',
            label: i18n.t('placeholder.newPassword'),
            validationRules: 'required|password',
        });
        this.repeatPassword = new FieldInfo({
            type: FieldType.Password,
            key: 'repeatPassword',
            value: '',
            label: i18n.t('placeholder.repeatPassword'),
            validationRules: 'required|confirmed:password',
        });
    }
}
export const useSection = () => {
    const EntityFormClass = ChangePassword;
    return {
        entityName: 'Password',
        EntityFormClass,
    };
};
//# sourceMappingURL=changePassword.js.map