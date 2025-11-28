import { getBooleanConfigParam } from '../fieldConfigs/base.config'
import { ConstructorFieldType } from '../constants'
import selectConfig from './select.config'

selectConfig.type = ConstructorFieldType.MultiSelectBaseField
selectConfig.configParams?.push(getBooleanConfigParam('appendToBody'))
selectConfig.configParams?.push(getBooleanConfigParam('withCopyId'))

const multiSelectConfig = selectConfig

export default multiSelectConfig
