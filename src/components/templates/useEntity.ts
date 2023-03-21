import { TableField } from '@core/components/table-fields/model'

const entityName: string = 'Entity'

// Entity list
export const useEntityList = () /*: UseListType */ => {
  // const ListFilterModel = EntityFiltersClass

  const fields = [
    // new TableField({ key: 'status', label: t('common.status') }), // For example
    new TableField({ key: 'actions', label: '' }),
  ]

  return {
    entityName,
    fields,
    // ListFilterModel,
  }
}

// Entity create & update
export const useEntity = () /*: UseEntityType<EntityFormClass> */ => {
  // const EntityFormClass = EntityFormClass

  return {
    entityName,
    // EntityFormClass
  }
}
