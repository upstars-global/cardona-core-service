import type { BaseFieldConfig, ConfigParams } from '../types'
import { ParamInputs } from '../types'
import type { ConstructorFieldType } from '../constants'
import { fieldsWithLocalization, fieldsWithPlaceholder } from '../constants'

const getBaseConfigParam = (params: ConfigParams) => params

export const getBooleanConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Boolean, value: false })
export const getTextConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Text, value: '' })
export const getSelectConfigParam = (key: string, value: Array<string> = []) => getBaseConfigParam({ key, input: ParamInputs.Select, value })

const canShowLocaleParams = (type: ConstructorFieldType, constructorFieldTypes: ConstructorFieldType[]) => constructorFieldTypes.includes(type)
const canAddPlaceholder = (type: ConstructorFieldType) => canShowLocaleParams(type, fieldsWithPlaceholder) ? 'placeholder' : ''
const canAddIsLocalization = (type: ConstructorFieldType) => canShowLocaleParams(type, fieldsWithLocalization) ? 'isLocalization' : ''

export const getBaseConfig = (config: Record<string, unknown>): BaseFieldConfig => {
  const isLocalizationConfigParam = canAddIsLocalization(config.type) ? [getBooleanConfigParam('isLocalization')] : []

  return {
    ...config,
    key: '',
    value: null,
    i18nKeys: [
      'label',
      'info',
      'description',
      canAddPlaceholder(config?.type),
    ].filter(Boolean),
    configParams: [
      ...config.options?.configParams || [],
      ...isLocalizationConfigParam,
    ].filter(Boolean),
  }
}

export const getNumberBaseConfig = ({ type, configParams }: { type: ConstructorFieldType; configParams?: ConfigParams[] }) => getBaseConfig({
  type,
  options: {
    configParams: [
      ...configParams || [],
      getBooleanConfigParam('withPositiveNumbers'),
      getBooleanConfigParam('isIntegerNumbers'),
    ],
  },
})
