import { ListFieldType, ListSize, TableField } from '@core/components/table-fields/model'
import { GamesFilters, EnabledGamesFilters } from '@model/games'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { UseListType } from '@/components/templates/BaseList/model'

const { t } = useI18nUtils()

export const useAllGames = (entityNameSection = ''): UseListType => {
  const entityName: string = entityNameSection + 'Games'
  const ListFilterModel = GamesFilters

  const fields = [
    new TableField({ key: 'selected', label: '' }),
    new TableField({ key: 'name', label: t('page.games.name'), sortable: true }),
  ]

  return {
    entityName,
    fields,
    ListFilterModel,
  }
}

export const useEnabledGames = (entityNameSection = ''): UseListType => {
  const entityName: string = entityNameSection + 'Games'
  const isGameTable: boolean = true
  const ListFilterModel = EnabledGamesFilters

  const fields = [
    new TableField({ key: 'selected', label: '' }),
    new TableField({ key: 'name', label: t('page.games.name') }),
    new TableField({
      key: 'position',
      type: ListFieldType.Priority,
      label: t('common.priority'),
      size: ListSize.SM,
      sortable: true,
    }),
  ]

  return {
    isGameTable,
    entityName,
    fields,
    ListFilterModel,
  }
}
