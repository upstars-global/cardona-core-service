import { BaseField } from './base';
import TimeField from '../../components/templates/FieldGenerator/_components/TimeField.vue';
export class TimeBaseField extends BaseField {
    component = TimeField;
    _value;
    constructor(field) {
        super(field);
        this._value = field.value;
    }
}
//# sourceMappingURL=time.js.map