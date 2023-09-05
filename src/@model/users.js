export class GroupData {
  id
  name
  users
  permissions
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.users = data.users.map((user) => new UserSmallInfo(user))
    this.permissions = data.permissions
  }
}
export var UserStatus
;(function (UserStatus) {
  UserStatus['active'] = 'active'
  UserStatus['inactive'] = 'inactive'
})(UserStatus || (UserStatus = {}))
export class UserInfo {
  id
  email
  firstName
  lastName
  userName
  name
  description
  roles
  status
  groups
  projects
  products
  permissions
  isPermissionAllUsers
  constructor(data) {
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
  static toStatus(isActive) {
    if (isActive) {
      return UserStatus.active
    }
    return UserStatus.inactive
  }
}
export class UserSmallInfo {
  id
  name
  constructor({ id, userName }) {
    this.id = Number(id)
    this.name = userName
  }
}
export class TemporaryUserInfo {
  userName
  email
  description
  password
  groupIds
  projectIds
  constructor({ userName, email, description, password, groupIds, projectIds }) {
    this.email = email
    this.userName = userName
    this.description = description
    this.password = password
    this.groupIds = groupIds
    this.projectIds = projectIds
  }
}
//# sourceMappingURL=user.js.map
