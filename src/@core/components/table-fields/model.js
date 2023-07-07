export class TableField {
    key;
    label;
    sortable;
    type;
    size;
    constructor(data) {
        this.key = data.key;
        this.label = data.label;
        this.sortable = data?.sortable;
        this.type = data?.type;
        this.size = data?.size || ListSize.MD;
    }
}
export var ListFieldType;
(function (ListFieldType) {
    ListFieldType["Status"] = "status";
    ListFieldType["PillStatus"] = "pill-status";
    ListFieldType["NameWithId"] = "name-with-id";
    ListFieldType["Email"] = "email";
    ListFieldType["Date"] = "date";
    ListFieldType["DateWithSeconds"] = "date-with-seconds";
    ListFieldType["Statement"] = "statement";
    ListFieldType["Priority"] = "priority";
    ListFieldType["Badges"] = "badges";
    ListFieldType["Percent"] = "percent";
    ListFieldType["Action"] = "action";
    ListFieldType["Button"] = "button";
    ListFieldType["SumAndCurrency"] = "sum-and-currency";
    ListFieldType["Comment"] = "comment";
    ListFieldType["Image"] = "image";
    ListFieldType["Period"] = "period";
    ListFieldType["Copy"] = "copy";
})(ListFieldType || (ListFieldType = {}));
export var ListSize;
(function (ListSize) {
    ListSize["SM"] = "sm";
    ListSize["MD"] = "md";
})(ListSize || (ListSize = {}));
//# sourceMappingURL=model.js.map