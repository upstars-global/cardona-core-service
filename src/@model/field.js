import store from '../store';
export var FieldType;
(function (FieldType) {
    FieldType["Text"] = "text";
    FieldType["Password"] = "password";
    FieldType["Number"] = "number";
    FieldType["Textarea"] = "textarea";
    FieldType["TextareaWithCounter"] = "textarea-with-counter";
    FieldType["RichText"] = "rich-text";
    FieldType["Check"] = "check";
    FieldType["CheckGroup"] = "check-group";
    FieldType["Select"] = "select";
    FieldType["MultiSelect"] = "multi-select";
    FieldType["DummySelect"] = "dummy-select";
    FieldType["Percent"] = "percent";
    FieldType["Minute"] = "minute";
    FieldType["Tags"] = "tags";
    FieldType["Radio"] = "radio";
    FieldType["Date"] = "date";
    FieldType["DateRange"] = "date-range";
    FieldType["DateTime"] = "date-time";
    FieldType["Switch"] = "switch";
    FieldType["SwitchWithState"] = "switch-with-state";
    FieldType["SumRange"] = "sum-range";
    FieldType["Phone"] = "phone";
    FieldType["Rates"] = "rates";
})(FieldType || (FieldType = {}));
export class FieldInfo {
    type;
    key;
    _value;
    label;
    options;
    fetchOptionsActionName;
    staticFilters;
    form;
    validationRules;
    isLocalization;
    placeholder;
    description;
    info;
    append;
    prepend;
    permission;
    maxLength;
    constructor({ type, key, value, label, options, fetchOptionsActionName, staticFilters, validationRules, form, isLocalization, placeholder, description, info, append, prepend, permission, maxLength, }) {
        this.type = type;
        this.key = key;
        this._value = value;
        this.label = label;
        this.options = options;
        this.fetchOptionsActionName = fetchOptionsActionName;
        this.staticFilters = staticFilters || {};
        this.form = form;
        this.validationRules = validationRules;
        this.isLocalization = isLocalization;
        this.placeholder = placeholder;
        this.description = description;
        this.info = info;
        this.append = append;
        this.prepend = prepend;
        this.permission = permission;
        this.maxLength = maxLength;
    }
    get value() {
        if (this.type === FieldType.Select) {
            return this._value ? this.checkSelectValue(this._value) : null;
        }
        else if (this.type === FieldType.MultiSelect) {
            return Array.isArray(this._value)
                ? this._value.map((item) => this.checkSelectValue(item))
                : !!this._value
                    ? [this.checkSelectValue(this._value)]
                    : [];
        }
        else if (this.type === FieldType.Tags) {
            return this._value || [];
        }
        else {
            return this._value;
        }
    }
    checkSelectValue(value) {
        return typeof value === 'string' ? this.convertStringToOptionsItem(value) : value;
    }
    convertStringToOptionsItem(value) {
        return { id: value, name: value };
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
            this.options = list.map((option) => this.checkSelectValue(option));
        }
    }
}
//# sourceMappingURL=field.js.map