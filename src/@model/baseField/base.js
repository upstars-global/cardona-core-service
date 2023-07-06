export class BaseField {
    key;
    label;
    placeholder;
    description;
    info;
    validationRules; // TODO: Expand for cases by type 'required|password'
    permission;
    isLocalization;
    form;
    constructor(field) {
        this.key = field.key;
        this.label = field.label;
        this.placeholder = field.placeholder;
        this.validationRules = Array.isArray(field.validationRules)
            ? field.validationRules.join('|')
            : field.validationRules;
        this.description = field.description;
        this.info = field.info;
        this.permission = field.permission;
        this.isLocalization = field.isLocalization;
        this.form = field.form;
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    transformField() {
        return this._value;
    }
}
//# sourceMappingURL=base.js.map