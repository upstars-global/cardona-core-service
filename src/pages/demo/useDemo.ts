import { useI18n } from 'vue-i18n'
import { DemoFilter, DemoForm, DemoListItem, DemoSideBar } from '../../@model/demo'
import { AlignType, ListFieldType, TableField } from '../../@model/templates/tableFields'
import type { UseEntityType } from '../../@model/templates/baseSection'
import type { UseListType } from '../../@model/templates/baseList'
import { useDemoStore } from '@/stores/demo'

const entityName = 'Demo'
export const useDemoList = (): UseListType => {
  const ListFilterModel = DemoFilter
  const SideBarModel = DemoSideBar
  const ListItemModel = DemoListItem
  const i18n = useI18n()

  const fields = [
    new TableField({
      key: 'expand',
      title: i18n.t('page.demo.expand'),
    }),
    new TableField({
      key: 'isActive',
      title: i18n.t('common.status'),
      type: ListFieldType.PillStatus,
      alwaysVisible: true,
    }),
    new TableField({
      key: 'status',
      title: i18n.t('common.status'),
      type: ListFieldType.Status,
      sortable: true,
    }),
    new TableField({
      key: 'editableField',
      title: i18n.t('common.editableField'),
    }),
    new TableField({
      key: 'shortId',
      title: i18n.t('common.shortId'),
      type: ListFieldType.CopyShort,
    }),
    new TableField({
      key: 'nameSlot',
      title: i18n.t('common.name'),
      type: ListFieldType.NameWithId,
    }),
    new TableField({
      key: 'nameWithShortId',
      title: i18n.t('common.nameWithShortId'),
      type: ListFieldType.NameWithShortId,
    }),
    new TableField({
      key: 'innerLink',
      title: i18n.t('common.link'),
    }),
    new TableField({
      key: 'buttonName',
      title: i18n.t('common.btn'),
      type: ListFieldType.Button,
    }),
    new TableField({
      key: 'tags',
      title: i18n.t('common.tags'),
      type: ListFieldType.Badges,
    }),
    new TableField({
      key: 'login',
      title: i18n.t('auth.login'),
      type: ListFieldType.Copy,
    }),
    new TableField({
      key: 'date',
      title: i18n.t('common.date'),
      type: ListFieldType.Date,
    }),
    new TableField({
      key: 'newDate',
      title: i18n.t('common.created'),
      type: ListFieldType.DateWithSeconds,
    }),
    new TableField({
      key: 'period',
      title: i18n.t('common.displayPeriod'),
      type: ListFieldType.Period,
    }),
    new TableField({
      key: 'sumPeriod',
      title: i18n.t('common.sumPeriod'),
    }),
    new TableField({
      key: 'imagePath',
      title: i18n.t('common.image'),
      type: ListFieldType.Image,
    }),
    new TableField({
      key: 'imageFull',
      title: i18n.t('common.image-with-full-view'),
      type: ListFieldType.ImageFull,
    }),
    new TableField({
      type: ListFieldType.Priority,
      key: 'position',
      title: i18n.t('common.priority'),
    }),
    new TableField({
      type: ListFieldType.Statement,
      key: 'state',
      title: i18n.t('common.state'),
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'amount',
      title: i18n.t('common.sum'),
      align: AlignType.Right,
    }),
    new TableField({
      type: ListFieldType.SumAndCurrency,
      key: 'winBack',
      title: i18n.t('common.sum'),
      align: AlignType.Right,
    }),
    new TableField({
      type: ListFieldType.Comment,
      key: 'comment',
      title: i18n.t('common.comment'),
    }),
    new TableField({
      key: 'gameId',
      title: i18n.t('filters.gameId'),
    }),
    new TableField({
      key: 'type',
      title: i18n.t('common.type'),
    }),
    new TableField({ key: 'actions', title: '' }),
    new TableField({ key: 'settings', title: i18n.t('common.settings') }),
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
    useStore: useDemoStore,
  }
}
