import type { Permission } from '../@model/permission'
import { UserSmallInfo } from '../@model/users'
import type { IRequestListPayload, OptionsItem } from '../@model/index'
import { ViewInfo, ViewType } from '../@model/view'
import { t } from '../plugins/i18n'
import { FieldInfo, FieldType } from '../@model/field'
import store from '../store'

export class GroupData {
  readonly id?: string
  readonly name: string
  readonly users: UserSmallInfo[]
  readonly permissions?: Permission[]

  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.users = data.users.map(user => new UserSmallInfo(user))
    this.permissions = data.permissions
  }
}

interface GroupListFilter {
  search: string
}

export interface GroupListPayload extends IRequestListPayload {
  readonly filter?: GroupListFilter
}

export class GroupsFilters implements GroupListFilter {
  readonly search: string

  constructor({ search }: GroupListFilter) {
    this.search = search
  }
}

export class GroupsSideBarFields {
  readonly id: ViewInfo
  readonly name: ViewInfo
  readonly users: ViewInfo

  constructor(data?: GroupData) {
    this.name = new ViewInfo({
      type: ViewType.Text,
      value: data?.name,
      label: t('common.groups._'),
    })
    this.id = new ViewInfo({
      type: ViewType.BadgeCopy,
      value: data?.id,
      label: t('page.groupList.groupID'),
    })
    this.users = new ViewInfo({
      type: ViewType.Badges,
      value: data?.users,
      withSearch: true,
      label: t('common.admin.fullListCount', { count: data?.users?.length }),
    })
  }
}

// Form
export class GroupForm {
  readonly id?: string
  readonly name?: FieldInfo<string>
  readonly userIds: FieldInfo<OptionsItem>
  readonly productId: string
  permissions?: Permission[]

  constructor(data?: any) {
    const users = data?.users.map(user => new UserSmallInfo(user))

    this.id = data?.id
    this.productId = store.getters['productCore/productId']
    this.name = new FieldInfo<string>({
      type: FieldType.Text,
      key: 'name',
      value: data?.name || '',
      label: t('common.groups.name'),
      placeholder: t('common.groups.name'),
      validationRules: 'required',
    })
    this.userIds = new FieldInfo<OptionsItem>({
      type: FieldType.MultiSelect,
      key: 'users',
      value: users || [],
      label: t('common.groups.adminAdd'),
      placeholder: t('placeholder.filter.admin'),
      fetchOptionsActionName: 'users/fetchUsersList',
    })
    this.permissions = data?.permissions || []
  }
}
