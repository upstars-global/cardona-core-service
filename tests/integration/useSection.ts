import type { UseListType } from '../../src/@model/templates/baseList'
import { ListFieldType, ListSize, TableField } from '../../src/@model/templates/tableFields'
import { mockCustomStore } from '../unit/mocks/base-list/utils'

import { i18n } from '../../src/plugins/i18n'
import { GameListItem, GamesFilters, GamesSideBarFields } from './model/game'

export const entityName = 'Games'

export const useGamesList = (): UseListType<GameListItem, GamesFilters, GamesSideBarFields> => {
  const ListFilterModel = GamesFilters
  const ListItemModel = GameListItem
  const SideBarModel = GamesSideBarFields

  const fields = [
    new TableField({ key: 'isActive', title: i18n.t('common.status'), type: ListFieldType.PillStatus }),
    new TableField({
      key: 'name',
      title: i18n.t('page.games.name'),
      sortable: true,
      type: ListFieldType.NameWithId,
    }),
    new TableField({ key: 'slug', title: i18n.t('common.slug') }),
    new TableField({ key: 'runner', title: i18n.t('page.games.runner') }),
    new TableField({ key: 'producer', title: i18n.t('title.gamesProducers._') }),
    new TableField({ key: 'type', title: i18n.t('common.type') }),
    new TableField({ key: 'categories', title: i18n.t('page.games.categories'), type: ListFieldType.Badges }),
    new TableField({ key: 'decreaseRatio', title: i18n.t('page.games.decreaseRatio') }),
    new TableField({
      key: 'wageringBonusRatio',
      title: i18n.t('page.games.wageringBonusRatio'),
      type: ListFieldType.Percent,
    }),
    new TableField({
      key: 'isGameOnBonuses',
      title: i18n.t('page.games.gameForBonuses'),
      type: ListFieldType.Statement,
    }),
    new TableField({
      key: 'isAvailableWithBonuses',
      title: i18n.t('page.games.availableWithBonuses'),
      type: ListFieldType.Statement,
    }),
    new TableField({
      key: 'tags',
      title: i18n.t('common.tags'),
      type: ListFieldType.Badges,
    }),
    new TableField({
      key: 'image',
      title: i18n.t('common.image'),
      type: ListFieldType.ImageFull,
      size: ListSize.SM,
    }),
    new TableField({
      key: 'createdAt',
      title: i18n.t('common.created'),
      sortable: true,
      type: ListFieldType.Date,
    }),
    new TableField({
      key: 'updatedAt',
      title: i18n.t('common.updated'),
      sortable: true,
      type: ListFieldType.Date,
    }),
    new TableField({ key: 'actions', title: '' }),
  ]

  return {
    ListItemModel,
    entityName,
    fields,
    ListFilterModel,
    SideBarModel,
    useStore: () => mockCustomStore,
  }
}
