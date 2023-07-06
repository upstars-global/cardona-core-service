import { ListFieldType, TableField } from '../../@core/components/table-fields/model';
import { useUtils as useI18nUtils } from '../../@core/libs/i18n';
import { DemoFilter, DemoForm, DemoSideBar } from '../../@model/demo';
const { t } = useI18nUtils();
const entityName = 'Demo';
export const useDemoList = () => {
    const ListFilterModel = DemoFilter;
    const SideBarModel = DemoSideBar;
    const fields = [
        new TableField({
            key: 'isActive',
            label: t('common.status'),
            type: ListFieldType.PillStatus,
        }),
        new TableField({
            key: 'status',
            label: t('common.status'),
            type: ListFieldType.Status,
        }),
        new TableField({
            key: 'name',
            label: t('common.name'),
            type: ListFieldType.NameWithId,
        }),
        new TableField({
            key: 'innerLink',
            label: t('common.link'),
        }),
        new TableField({
            key: 'buttonName',
            label: t('common.btn'),
            type: ListFieldType.Button,
        }),
        new TableField({
            key: 'tags',
            label: t('common.tags'),
            type: ListFieldType.Badges,
        }),
        new TableField({
            key: 'login',
            label: t('auth.login'),
            type: ListFieldType.Copy,
        }),
        new TableField({
            key: 'date',
            label: t('common.date'),
            type: ListFieldType.Date,
        }),
        new TableField({
            key: 'newDate',
            label: t('common.created'),
            type: ListFieldType.DateWithSeconds,
        }),
        new TableField({
            key: 'period',
            label: t('common.displayPeriod'),
            type: ListFieldType.Period,
        }),
        new TableField({
            key: 'sumPeriod',
            label: t('common.sumPeriod'),
        }),
        new TableField({
            key: 'imagePath',
            label: t('common.image'),
            type: ListFieldType.Image,
        }),
        new TableField({
            type: ListFieldType.Priority,
            key: 'position',
            label: t('common.priority'),
        }),
        new TableField({
            type: ListFieldType.Statement,
            key: 'state',
            label: t('common.state'),
        }),
        new TableField({
            type: ListFieldType.SumAndCurrency,
            key: 'amount',
            label: t('common.sum'),
        }),
        new TableField({
            type: ListFieldType.SumAndCurrency,
            key: 'winBack',
            label: t('common.sum'),
        }),
        new TableField({
            type: ListFieldType.Comment,
            key: 'comment',
            label: t('common.comment'),
        }),
        new TableField({
            key: 'gameId',
            label: t('filters.gameId'),
        }),
        new TableField({
            key: 'type',
            label: t('common.type'),
        }),
        new TableField({ key: 'actions', label: '' }),
    ];
    return {
        entityName,
        fields,
        ListFilterModel,
        SideBarModel,
    };
};
export const useDemoSection = () => {
    const EntityFormClass = DemoForm;
    return {
        entityName,
        EntityFormClass,
    };
};
//# sourceMappingURL=useDemo.js.map