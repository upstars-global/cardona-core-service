import { Permission } from './permission'
import { ProjectInfo } from './project'
import { OptionsItem } from '../@model/index'
import { GroupData } from './group'

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
}
export interface IUserInfo {
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
  readonly password?: string
  readonly productIds?: number[]
}

export class UserInfo implements IUserInfo {
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
  readonly password: string
  readonly productIds: number[]

  constructor(data?: IUserInfo) {
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
    this.password = data?.password || ''
    this.productIds = data?.productIds || []
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

export interface IUserSmallInfo {
  readonly id: number
  readonly userName: string
}
export class UserSmallInfo {
  readonly id: number
  readonly name: string

  constructor({ id, userName }: IUserSmallInfo) {
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
