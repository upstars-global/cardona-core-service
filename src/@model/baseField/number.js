import { TextBaseField } from './text';
import NumberField from '../../components/templates/FieldGenerator/_components/NumberField.vue';
export class NumberBaseField extends TextBaseField {
    component = NumberField;
    constructor(field) {
        super(field);
    }
}
//# sourceMappingURL=number.js.map