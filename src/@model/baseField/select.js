import store from '../../store';
import { BaseField } from './base';
import SelectField from '../../components/templates/FieldGenerator/_components/SelectField.vue';
export class SelectBaseField extends BaseField {
    component = SelectField;
    _value;
    options;
    fetchOptionsActionName;
    staticFilters;
    constructor(field) {
        super(field);
        this._value = field.value;
        this.options = field.options;
        this.fetchOptionsActionName = field.fetchOptionsActionName;
        this.staticFilters = field.staticFilters || {};
    }
    async fetchOptions(search = '') {
        if (this.fetchOptionsActionName) {
            const { list } = await store.dispatch(this.fetchOptionsActionName, {
                perPage: 50,
                filter: {
                    search,
                    ...this.staticFilters,
                },
            });
            this.options = list.map((option) => typeof option === 'string' ? { id: option, name: option } : option);
        }
    }
    transformField() {
        return this.value?.id ?? this.value ?? '';
    }
}
//# sourceMappingURL=select.js.map