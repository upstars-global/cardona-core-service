import { DemoFilter, DemoForm, DemoListItem, DemoSideBar } from '../../@model/demo'
import { AlignType, ListFieldType, TableField } from '../../@model/templates/tableFields'
import type { UseEntityType } from '../../@model/templates/baseSection'
import type { UseListType } from '../../@model/templates/baseList'
import { t } from '@/plugins/i18n'

const entityName = 'Demo'

export const useDemoList = (): UseListType => {
  const ListFilterModel = DemoFilter
  const SideBarModel = DemoSideBar
  const ListItemModel = DemoListItem

  const fields = [
    new TableField({
      key: 'isActive',
      title: t('common.status'),
      type: ListFieldType.PillStatus,
    }),
    new TableField({
      key: 'status',
      title: t('common.status'),
      type: ListFieldType.Status,
    }),
    new TableField({
      key: 'shortId',
      title: t('common.shortId'),
      type: ListFieldType.CopyShort,
    }),
    new TableField({
      key: 'nameSlot',
      title: t('common.name'),
      type: ListFieldType.NameWithId,
    }),
    new TableField({
      key: 'nameWithShortId',
      title: t('common.nameWithShortId'),
      type: ListFieldType.NameWithShortId,
    }),
    new TableField({
      key: 'innerLink',
      title: t('common.link'),
    }),
    new TableField({
      key: 'buttonName',
      title: t('common.btn'),
      type: ListFieldType.Button,
    }),
    new TableField({
      key: 'tags',
      title: t('common.tags'),
      type: ListFieldType.Badges,
    }),
    new TableField({
      key: 'login',
      title: t('auth.login'),
      type: ListFieldType.Copy,
    }),
    new TableField({
      key: 'date',
      title: t('common.date'),
      type: ListFieldType.Date,
    }),
    new TableField({
      key: 'newDate',
      title: t('common.created'),
      type: ListFieldType.DateWithSeconds,
    }),
    new TableField({
      key: 'period',
      title: t('common.displayPeriod'),
      type: ListFieldType.Period,
    }),
    new TableField({
      key: 'sumPeriod',
      title: t('common.sumPeriod'),
    }),
    new TableField({
      key: 'imagePath',
      title: t('common.image'),
      type: ListFieldType.Image,
    }),
    new TableField({
      key: 'imageFull',
      title: t('common.image-with-full-view'),
      type: ListFieldType.ImageFull,
    }),
    new TableField({
      type: ListFieldType.Priority,
      key: 'position',
      title: t('common.priority'),
    }),
    new TableField({
      type: ListFieldType.Statement,
      key: 'state',
      title: t('common.state'),
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'amount',
      title: t('common.sum'),
      align: AlignType.Right,
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'winBack',
      title: t('common.sum'),
      align: AlignType.Right,
    }),
    new TableField({
      type: ListFieldType.Comment,
      key: 'comment',
      title: t('common.comment'),
    }),
    new TableField({
      key: 'gameId',
      title: t('filters.gameId'),
    }),
    new TableField({
      key: 'type',
      title: t('common.type'),
    }),
    new TableField({ key: 'actions', title: '' }),
  ]

  return {
    ListItemModel,
    entityName,
    fields,
    ListFilterModel,
    SideBarModel,
  }
}

export const useDemoSection = (): UseEntityType<DemoForm> => {
  const EntityFormClass = DemoForm

  return {
    entityName,
    EntityFormClass,
  }
}
