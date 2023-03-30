import { Permission } from './permission'
import { ProjectInfo } from './project'
import { OptionsItem } from '../@model/index'

export class GroupData {
  readonly id?: string
  readonly name: string
  readonly users: UserSmallInfo[]
  readonly permissions?: Permission[]

  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.users = data.users.map((user) => new UserSmallInfo(user))
    this.permissions = data.permissions
  }
}
export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}
interface UserInfoInput {
  readonly id: number
  readonly firstName: string
  readonly lastName: string
  readonly userName: string
  readonly name?: string
  readonly email: string
  readonly description: string
  readonly roles: string[]
  readonly isActive?: boolean
  readonly status: UserStatus
  readonly groups: GroupData[]
  readonly projects: ProjectInfo[]
  readonly products: OptionsItem[]
  readonly permissions: Permission[]
  readonly isPermissionAllUsers?: boolean
}

export interface UserSmallInfoInput {
  readonly id: number
  readonly userName: string
}

interface UserListFilter {
  readonly search: string
  readonly groupIds?: number[]
  readonly projectIds?: number[]
  readonly isActive?: boolean
}

export interface UserListInput {
  readonly page?: number
  readonly perPage?: number
  readonly filter?: UserListFilter
}

export class UserInfo implements UserInfoInput {
  readonly id: number
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly userName: string
  readonly name: string
  readonly description: string
  readonly roles: string[]
  readonly status: UserStatus
  readonly groups: GroupData[]
  readonly projects: ProjectInfo[]
  readonly products: OptionsItem[]
  readonly permissions: Permission[]
  readonly isPermissionAllUsers?: boolean

  constructor(data?: UserInfoInput) {
    this.id = Number(data?.id) || 0
    this.email = data?.email || ''
    this.firstName = data?.firstName || ''
    this.lastName = data?.lastName || ''
    this.userName = data?.userName || ''
    this.name = data?.userName || data?.name || ''
    this.description = data?.description || ''
    this.roles = data?.roles || []
    this.status = data?.status || data?.isActive ? UserStatus.active : UserStatus.inactive
    this.groups = data?.groups || []
    this.projects = data?.projects || []
    this.products = data?.products || []
    this.permissions = data?.permissions || []
    this.isPermissionAllUsers = data?.isPermissionAllUsers
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  get isActive() {
    return this.status === UserStatus.active
  }

  get isEmpty() {
    return this.id === 0
  }

  static toStatus(isActive: boolean) {
    if (isActive) {
      return UserStatus.active
    }

    return UserStatus.inactive
  }
}

export class UserSmallInfo {
  readonly id: number
  readonly name: string

  constructor({ id, userName }: UserSmallInfoInput) {
    this.id = Number(id)
    this.name = userName
  }
}

interface TemporaryUserInfoInput {
  readonly userName: string
  readonly email: string
  readonly description: string
  readonly password: string
  readonly groupIds: number[]
  readonly projectIds: number[]
}

export class TemporaryUserInfo implements TemporaryUserInfoInput {
  readonly userName: string
  readonly email: string
  readonly description: string
  readonly password: string
  readonly groupIds: number[]
  readonly projectIds: number[]

  constructor({ userName, email, description, password, groupIds, projectIds }: TemporaryUserInfo) {
    this.email = email
    this.userName = userName
    this.description = description
    this.password = password
    this.groupIds = groupIds
    this.projectIds = projectIds
  }
}
