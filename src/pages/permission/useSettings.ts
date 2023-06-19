import { useUtils as useI18nUtils } from '../../@core/libs/i18n'
import { UseEntityType } from '../../components/templates/BaseSection/model'
import { GroupForm } from '../../@model/group'

const entityName = 'Permission'

export const useSection = (): UseEntityType<GroupForm> => {
  const EntityFormClass = GroupForm

  return {
    entityName,
    EntityFormClass,
  }
}
