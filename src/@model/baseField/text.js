import { BaseField } from './base';
import TextField from '../../components/templates/FieldGenerator/_components/TextField.vue';
export class TextBaseField extends BaseField {
    component = TextField;
    _value;
    prepend;
    append;
    constructor(field) {
        super(field);
        this._value = field.value;
        this.prepend = field.prepend;
        this.append = field.append;
    }
}
//# sourceMappingURL=text.js.map