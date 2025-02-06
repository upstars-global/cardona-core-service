import { GroupForm } from '../../@model/group'
import type { UseEntityType } from '../../@model/templates/baseSection'

const entityName = 'Permission'

export const useSection = (): UseEntityType<GroupForm> => {
  const EntityFormClass = GroupForm

  return {
    entityName,
    EntityFormClass,
  }
}
