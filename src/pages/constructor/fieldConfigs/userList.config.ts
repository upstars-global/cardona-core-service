import type { BaseFieldConfig } from '../types'
import {
  getBaseConfig,
  getBooleanConfigParam,
  getSelectConfigParam,
  getTextConfigParam,
} from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import { DataPickerPosition } from '@/@model/templates/baseField/date'

const userListConfig: BaseFieldConfig = getBaseConfig({
  type: ConstructorFieldType.UsersListBaseField,
})

export default userListConfig
