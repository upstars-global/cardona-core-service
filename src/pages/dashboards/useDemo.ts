import type { UseListType } from '../../components/templates/BaseList/model'
import { DemoFilter, DemoListItem, DemoSideBar } from '../../@model/demo'
import { ListFieldType, TableField } from '../../@model/templates/tableFields'
import i18n from '@/plugins/i18n'

const entityName = 'Demo'

export const useDemoList = (): UseListType => {
  const ListFilterModel = DemoFilter
  const SideBarModel = DemoSideBar
  const ListItemModel = DemoListItem

  const fields = [
    new TableField({
      key: 'isActive',
      title: i18n.global.t('common.status'),
      type: ListFieldType.PillStatus,
    }),
    new TableField({
      key: 'status',
      title: i18n.global.t('common.status'),
      type: ListFieldType.Status,
    }),
    new TableField({
      key: 'shortId',
      title: i18n.global.t('common.shortId'),
      type: ListFieldType.CopyShort,
    }),
    new TableField({
      key: 'nameSlot',
      title: i18n.global.t('common.name'),
      type: ListFieldType.NameWithId,
    }),
    new TableField({
      key: 'nameWithShortId',
      title: i18n.global.t('common.nameWithShortId'),
      type: ListFieldType.NameWithShortId,
    }),
    new TableField({
      key: 'innerLink',
      title: i18n.global.t('common.link'),
    }),
    new TableField({
      key: 'buttonName',
      title: i18n.global.t('common.btn'),
      type: ListFieldType.Button,
    }),
    new TableField({
      key: 'tags',
      title: i18n.global.t('common.tags'),
      type: ListFieldType.Badges,
    }),
    new TableField({
      key: 'login',
      title: i18n.global.t('auth.login'),
      type: ListFieldType.Copy,
    }),
    new TableField({
      key: 'date',
      title: i18n.global.t('common.date'),
      type: ListFieldType.Date,
    }),
    new TableField({
      key: 'newDate',
      title: i18n.global.t('common.created'),
      type: ListFieldType.DateWithSeconds,
    }),
    new TableField({
      key: 'period',
      title: i18n.global.t('common.displayPeriod'),
      type: ListFieldType.Period,
    }),
    new TableField({
      key: 'sumPeriod',
      title: i18n.global.t('common.sumPeriod'),
    }),
    new TableField({
      key: 'imagePath',
      title: i18n.global.t('common.image'),
      type: ListFieldType.Image,
    }),
    new TableField({
      key: 'imageFull',
      title: i18n.global.t('common.image-with-full-view'),
      type: ListFieldType.ImageFull,
    }),
    new TableField({
      type: ListFieldType.Priority,
      key: 'position',
      title: i18n.global.t('common.priority'),
    }),
    new TableField({
      type: ListFieldType.Statement,
      key: 'state',
      title: i18n.global.t('common.state'),
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'amount',
      title: i18n.global.t('common.sum'),
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'winBack',
      title: i18n.global.t('common.sum'),
    }),
    new TableField({
      type: ListFieldType.Comment,
      key: 'comment',
      title: i18n.global.t('common.comment'),
    }),
    new TableField({
      key: 'gameId',
      title: i18n.global.t('filters.gameId'),
    }),
    new TableField({
      key: 'type',
      title: i18n.global.t('common.type'),
    }),
    new TableField({ key: 'actions', title: 'actions' }),
  ]

  return {
    ListItemModel,
    entityName,
    fields,
    ListFilterModel,
    SideBarModel,
  }
}
