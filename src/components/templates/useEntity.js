import { TableField } from '../../@core/components/table-fields/model';
const entityName = 'Entity';
// Entity list
export const useEntityList = () => {
    // const ListFilterModel = EntityFiltersClass
    const fields = [
        // new TableField({ key: 'status', label: t('common.status') }), // For example
        new TableField({ key: 'actions', label: '' }),
    ];
    return {
        entityName,
        fields,
        // ListFilterModel,
    };
};
// Entity create & update
export const useEntity = () => {
    // const EntityFormClass = EntityFormClass
    return {
        entityName,
        // EntityFormClass
    };
};
//# sourceMappingURL=useEntity.js.map