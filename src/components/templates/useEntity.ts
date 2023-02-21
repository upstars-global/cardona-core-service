import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { TableField } from '@core/components/table-fields/model'
import { UseListType } from '@/components/templates/BaseList/model'
import { UseEntityType } from '@/components/templates/BaseCreateUpdate/model'

const { t } = useI18nUtils()

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
export const useEntity = () /*: UseEntityType */ => {
  // const EntityFormClass = EntityFormClass

  return {
    entityName,
    // EntityFormClass
  }
}
