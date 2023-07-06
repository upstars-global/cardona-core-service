export var ViewType;
(function (ViewType) {
    ViewType["Text"] = "text";
    ViewType["Locale"] = "locale";
    ViewType["Region"] = "region";
    ViewType["Textarea"] = "textarea";
    ViewType["Link"] = "link";
    ViewType["InnerBlankLink"] = "inner-blank-link";
    ViewType["Badges"] = "badges";
    ViewType["Badge"] = "badge";
    ViewType["Status"] = "status";
    ViewType["Statement"] = "statement";
    ViewType["Date"] = "date";
    ViewType["DateWithSeconds"] = "date-with-seconds";
    ViewType["BadgeCopy"] = "badge-copy";
    ViewType["Copy"] = "copy";
    ViewType["SumAndCurrency"] = "sum-and-currency";
    ViewType["StatusWithDate"] = "status-with-date";
    ViewType["StatusWithDateHistory"] = "status-with-date-history";
    ViewType["Comment"] = "comment";
    ViewType["TransactionType"] = "transaction-type";
    ViewType["ObjectToRows"] = "object-to-rows";
    ViewType["SumPeriod"] = "sum-period";
})(ViewType || (ViewType = {}));
export var ViewJustifyContent;
(function (ViewJustifyContent) {
    ViewJustifyContent["Start"] = "start";
    ViewJustifyContent["Between"] = "between";
    ViewJustifyContent["End"] = "end";
    ViewJustifyContent["Center"] = "center";
})(ViewJustifyContent || (ViewJustifyContent = {}));
export class StatusWithVariant {
    status;
    variant;
    constructor(status, variant) {
        this.status = status;
        this.variant = variant;
    }
}
//TODO: Delete T = {} All project https://upstars.atlassian.net/browse/BAC-1177
export class ViewInfo {
    type;
    value;
    label;
    description;
    icon;
    withSeparator;
    permission;
    withSearch;
    constructor(data) {
        this.type = data?.type;
        this.value = data?.value;
        this.label = data?.label;
        this.description = data?.description;
        this.icon = data?.icon;
        this.withSeparator = data?.withSeparator;
        this.withSearch = data?.withSearch;
        this.permission = data?.permission;
    }
}
//# sourceMappingURL=view.js.map