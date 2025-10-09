import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'

const userListConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.UsersListBaseField,
})

export default userListConfig
