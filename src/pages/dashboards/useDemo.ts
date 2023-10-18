import type { UseListType } from '../../components/templates/BaseList/model'
import { DemoFilter, DemoListItem, DemoSideBar } from '../../@model/demo'
import { ListFieldType, TableField } from '../../@model/templates/tableFields'

const entityName = 'Demo'

export const useDemoList = (): UseListType => {
  const ListFilterModel = DemoFilter
  const SideBarModel = DemoSideBar
  const ListItemModel = DemoListItem

  const fields = [
    new TableField({
      key: 'isActive',
      label: 'i18n.global.t(\'common.status\')',
      type: ListFieldType.PillStatus,
    }),
    new TableField({
      key: 'status',
      label: 'i18n.global.t(\'common.status\')',
      type: ListFieldType.Status,
    }),
    new TableField({
      key: 'shortId',
      label: 'i18n.global.t(\'common.shortId\')',
      type: ListFieldType.CopyShort,
    }),
    new TableField({
      key: 'nameSlot',
      label: 'i18n.global.t(\'common.name\')',
      type: ListFieldType.NameWithId,
    }),
    new TableField({
      key: 'nameWithShortId',
      label: 'i18n.global.t(\'common.nameWithShortId\')',
      type: ListFieldType.NameWithShortId,
    }),
    new TableField({
      key: 'innerLink',
      label: 'i18n.global.t(\'common.link\')',
    }),
    new TableField({
      key: 'buttonName',
      label: 'i18n.global.t(\'common.btn\')',
      type: ListFieldType.Button,
    }),
    new TableField({
      key: 'tags',
      label: 'i18n.global.t(\'common.tags\')',
      type: ListFieldType.Badges,
    }),
    new TableField({
      key: 'login',
      label: 'i18n.global.t(\'auth.login\')',
      type: ListFieldType.Copy,
    }),
    new TableField({
      key: 'date',
      label: 'i18n.global.t(\'common.date\')',
      type: ListFieldType.Date,
    }),
    new TableField({
      key: 'newDate',
      label: 'i18n.global.t(\'common.created\')',
      type: ListFieldType.DateWithSeconds,
    }),
    new TableField({
      key: 'period',
      label: 'i18n.global.t(\'common.displayPeriod\')',
      type: ListFieldType.Period,
    }),
    new TableField({
      key: 'sumPeriod',
      label: 'i18n.global.t(\'common.sumPeriod\')',
    }),
    new TableField({
      key: 'imagePath',
      label: 'i18n.global.t(\'common.image\')',
      type: ListFieldType.Image,
    }),
    new TableField({
      key: 'imageFull',
      label: 'i18n.global.t(\'common.image-with-full-view\')',
      type: ListFieldType.ImageFull,
    }),
    new TableField({
      type: ListFieldType.Priority,
      key: 'position',
      label: 'i18n.global.t(\'common.priority\')',
    }),
    new TableField({
      type: ListFieldType.Statement,
      key: 'state',
      label: 'i18n.global.t(\'common.state\')',
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'amount',
      label: 'i18n.global.t(\'common.sum\')',
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'winBack',
      label: 'i18n.global.t(\'common.sum\')',
    }),
    new TableField({
      type: ListFieldType.Comment,
      key: 'comment',
      label: 'i18n.global.t(\'common.comment\')',
    }),
    new TableField({
      key: 'gameId',
      label: 'i18n.global.t(\'filters.gameId\')',
    }),
    new TableField({
      key: 'type',
      label: 'i18n.global.t(\'common.type\')',
    }),
    new TableField({ key: 'actions', label: '' }),
  ]

  return {
    ListItemModel,
    entityName,
    fields,
    ListFilterModel,
    SideBarModel,
  }
}
