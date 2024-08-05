import type { Permission } from '../@model/permission'
import {UserInfo, UserSmallInfo} from '../@model/users'
import type { IRequestListPayload } from '../@model/index'
import { ViewInfo, ViewType } from '../@model/view'
import { i18n } from '../plugins/i18n'
import store from '../store'
import {MultiSelectBaseField, TextBaseField} from "../@model/templates/baseField";

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
    this.id = new ViewInfo({
      type: ViewType.BadgeCopy,
      value: data?.id,
      label: i18n.t('page.groupList.groupID'),
    })
    this.name = new ViewInfo({
      type: ViewType.Text,
      value: data?.name,
      label: i18n.t('common.groups._'),
    })
    this.users = new ViewInfo({
      type: ViewType.Badges,
      value: data?.users,
      withSearch: true,
      label: i18n.t('common.admin.fullListCount', { count: data?.users?.length }),
    })
  }
}

// Form
export class GroupForm {
  readonly id?: string
  readonly name: TextBaseField
  readonly userIds: MultiSelectBaseField
  readonly productId: string
  permissions?: Permission[]

  constructor(data?: any) {
    const users = data?.users.map((user) => new UserSmallInfo(user))
    this.id = data?.id
    this.productId = store.getters['productCore/productId']
    this.name = new TextBaseField({
      key: 'name',
      value: data?.name,
      label: i18n.t('common.groups.name'),
      placeholder: i18n.t('common.groups.name'),
      validationRules: 'required',
    })
    this.userIds = new MultiSelectBaseField<UserInfo>({
      key: 'users',
      value: users,
      label: i18n.t('common.groups.adminAdd'),
      placeholder: i18n.t('placeholder.filter.admin'),
      fetchOptionsActionName: 'users/fetchUsersList',
    });
    this.permissions = data?.permissions || []
  }
}
