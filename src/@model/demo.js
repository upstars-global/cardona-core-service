import i18n from '../libs/i18n';
import { NumberBaseField, SelectBaseField, TextBaseField } from './baseField';
import { FieldInfo, FieldType } from './field';
import { getLocaleDateStringWithoutTimezone } from '../helpers/date';
import { StatusWithVariant, ViewInfo, ViewType } from './view';
import { SideBarCollapseItem } from '../components/templates/BaseList/model';
export class DemoFilter {
    search;
    isActive;
    type;
    tagsIds;
    gameId;
    createdFrom;
    createdTo;
    constructor(data) {
        this.search = data.search;
        this.createdFrom = data.createdFrom;
        this.createdTo = data.createdTo;
        this.isActive = data.isActive;
        this.tagsIds = data.tagsIds;
        this.type = data.type;
        this.gameId = data.gameId;
    }
}
export class DemoForm {
    id;
    switch;
    switchWithState;
    text;
    number;
    minute;
    sumRange;
    percent;
    password;
    phone;
    check;
    radio;
    checkGroup;
    select;
    multiSelect;
    date;
    dateRange;
    dateTime;
    textarea;
    textareaWithCounter;
    tags;
    seo;
    fieldTranslations;
    constructor(data) {
        this.id = data?.id;
        this.switch = new FieldInfo({
            type: FieldType.Switch,
            key: 'switch',
            value: data?.switch,
            label: i18n.t('page.demo.switchField'),
        });
        this.text = new TextBaseField({
            key: 'text',
            value: data?.text,
            label: i18n.t('page.demo.textField'),
            validationRules: 'required',
            isLocalization: true,
        });
        this.number = new NumberBaseField({
            key: 'number',
            value: data?.number,
            label: i18n.t('page.demo.numberField'),
        });
        this.minute = new FieldInfo({
            type: FieldType.Minute,
            key: 'minute',
            value: data?.minute,
            label: i18n.t('page.demo.minuteField'),
        });
        this.percent = new FieldInfo({
            type: FieldType.Percent,
            key: 'percent',
            value: data?.percent,
            label: i18n.t('page.demo.percentField'),
        });
        this.sumRange = new FieldInfo({
            type: FieldType.SumRange,
            key: 'sumRange',
            value: data?.sumRange,
            label: i18n.t('page.demo.sumRangeField'),
        });
        this.phone = new FieldInfo({
            type: FieldType.Phone,
            key: 'phone',
            value: data?.phone,
            label: i18n.t('page.demo.phoneField'),
        });
        this.password = new FieldInfo({
            type: FieldType.Password,
            key: 'password',
            value: data?.password,
            label: i18n.t('page.demo.passwordField'),
        });
        this.switchWithState = new FieldInfo({
            type: FieldType.SwitchWithState,
            key: 'switchWithState',
            value: data?.switchWithState,
            label: i18n.t('page.demo.switchWithStateField'),
        });
        this.check = new FieldInfo({
            type: FieldType.Check,
            key: 'check',
            value: data?.check,
            label: i18n.t('page.demo.checkField'),
        });
        this.checkGroup = new FieldInfo({
            type: FieldType.CheckGroup,
            key: 'checkGroup',
            value: data?.checkGroup,
            label: i18n.t('page.demo.checkGroupField'),
            options: [
                {
                    id: 'option1',
                    name: 'Option 1',
                },
                {
                    id: 'option2',
                    name: 'Option 2',
                },
                {
                    id: 'option3',
                    name: 'Option 3',
                },
                {
                    id: 'option4',
                    name: 'Option 4',
                },
                {
                    id: 'option5',
                    name: 'Option 5',
                },
            ],
        });
        this.radio = new FieldInfo({
            type: FieldType.Radio,
            key: 'radio',
            value: true,
            label: i18n.t('page.demo.radioField'),
            options: [
                { text: i18n.t('common.yes'), value: true },
                { text: i18n.t('common.no'), value: false },
            ],
        });
        this.date = new FieldInfo({
            type: FieldType.Date,
            key: 'date',
            value: getLocaleDateStringWithoutTimezone(data?.date),
            label: i18n.t('page.demo.dateField'),
        });
        this.dateRange = new FieldInfo({
            type: FieldType.DateRange,
            key: 'dateRange',
            value: data?.dateRange,
            label: i18n.t('page.demo.dateRangeField'),
        });
        this.dateTime = new FieldInfo({
            type: FieldType.DateTime,
            key: 'dateTime',
            value: getLocaleDateStringWithoutTimezone(data?.dateTime),
            label: i18n.t('page.demo.dateTimeField'),
        });
        this.select = new SelectBaseField({
            key: 'select',
            value: data?.select,
            label: i18n.t('page.demo.selectField'),
            fetchOptionsActionName: 'demo/fetchOptions',
        });
        this.multiSelect = new FieldInfo({
            type: FieldType.MultiSelect,
            key: 'multiSelect',
            value: data?.multiSelect,
            label: i18n.t('page.demo.multiSelectField'),
            fetchOptionsActionName: 'demo/fetchOptions',
        });
        this.textarea = new FieldInfo({
            type: FieldType.Textarea,
            value: data?.textarea,
            key: 'textarea',
            label: i18n.t('page.demo.textareaField'),
        });
        this.textareaWithCounter = new FieldInfo({
            type: FieldType.TextareaWithCounter,
            value: data?.textareaWithCounter,
            key: 'textareaWithCounter',
            label: i18n.t('page.demo.textareaWithCounterField'),
            maxLength: 45,
        });
        this.tags = new FieldInfo({
            type: FieldType.Tags,
            value: data?.tags,
            key: 'tags',
            label: i18n.t('page.demo.tagsField'),
        });
        this.seo = data?.seo;
        this.fieldTranslations = data?.fieldTranslations;
    }
}
export class DemoSideBar {
    generalInfo;
    info;
    unuseble;
    constructor(data) {
        this.generalInfo = new SideBarCollapseItem({
            title: i18n.t('common.generalInformation'),
            withBottomSeparator: true,
            views: {
                comment: new ViewInfo({
                    type: ViewType.Comment,
                    value: data?.comment,
                    label: i18n.t('common.comment'),
                }),
                name: new ViewInfo({
                    type: ViewType.Text,
                    value: data?.name,
                    label: i18n.t('common.name'),
                }),
                type: new ViewInfo({
                    type: ViewType.TransactionType,
                    value: data?.type.id,
                    label: i18n.t('common.type'),
                }),
                date: new ViewInfo({
                    type: ViewType.Date,
                    value: data?.date,
                    label: i18n.t('common.date'),
                }),
                id: new ViewInfo({
                    type: ViewType.BadgeCopy,
                    value: data?.id,
                    label: i18n.t('common.id'),
                }),
            },
        });
        this.info = new SideBarCollapseItem({
            title: i18n.t('common.mainInfo'),
            withBottomSeparator: true,
            views: {
                isActive: new ViewInfo({
                    type: ViewType.Statement,
                    value: !!data?.isActive,
                    label: i18n.t('common.isActive'),
                    withSeparator: true,
                }),
                amount: new ViewInfo({
                    type: ViewType.SumAndCurrency,
                    value: { amount: data?.amount, currency: data?.currency },
                    label: i18n.t('common.sum'),
                }),
                id: new ViewInfo({
                    type: ViewType.Status,
                    value: data?.status,
                    label: i18n.t('common.status'),
                }),
                tags: new ViewInfo({
                    type: ViewType.Badges,
                    value: data?.tags,
                    withSearch: true,
                    label: i18n.t('common.tags', { count: data?.tags?.length }),
                }),
                email: new ViewInfo({
                    type: ViewType.Copy,
                    value: data?.email,
                    label: i18n.t('common.email'),
                    icon: 'AtSignIcon',
                }),
                newDate: new ViewInfo({
                    type: ViewType.DateWithSeconds,
                    value: data?.newDate,
                    label: i18n.t('common.dateOfCreation'),
                }),
                localization: new ViewInfo({
                    type: ViewType.Locale,
                    value: data?.localization,
                    label: i18n.t('common.locale._'),
                }),
                statusList: new ViewInfo({
                    type: ViewType.StatusWithDateHistory,
                    value: [
                        {
                            status: new StatusWithVariant('active', 'light-warning'),
                            updatedAt: data?.date,
                        },
                        {
                            status: new StatusWithVariant('expired', 'light-danger'),
                            updatedAt: data?.date,
                        },
                        {
                            status: new StatusWithVariant('new', 'light-secondary'),
                            updatedAt: data?.date,
                        },
                    ],
                    label: i18n.t('common.log'),
                }),
            },
        });
        this.unuseble = new SideBarCollapseItem({
            title: i18n.t('common.additionalInfo'),
            views: {
                link: new ViewInfo({
                    type: ViewType.Link,
                    value: { route: { name: 'PermissionPage' }, title: 'BO-Permission' },
                    label: i18n.t('common.link'),
                }),
                objectToRows: new ViewInfo({
                    type: ViewType.ObjectToRows,
                    value: data?.period,
                    label: i18n.t('common.data'),
                }),
                statusWithDate: new ViewInfo({
                    type: ViewType.StatusWithDate,
                    value: {
                        status: new StatusWithVariant('active', 'light-warning'),
                        updatedAt: data?.date,
                    },
                    label: i18n.t('common.status'),
                }),
            },
        });
    }
}
//# sourceMappingURL=demo.js.map