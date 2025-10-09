import type { BaseFieldConfig, ConfigParams } from '../types'
import { ParamInputs } from '../types'
import type { ConstructorFieldType } from '@/pages/constructor/constants'

const getBaseConfigParam = (params: ConfigParams) => params

export const getBooleanConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Boolean, value: false })
export const getTextConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Text, value: '' })
export const getSelectConfigParam = (key: string, value: Array<string> = []) => getBaseConfigParam({ key, input: ParamInputs.Select, value })

export const getBaseConfig = (config: Record<string, unknown>): BaseFieldConfig => ({
  ...config,
  key: '',
  value: null,
  i18nKeys: ['label', 'placeholder', 'info', 'description'],
  configParams: [
    ...config.options?.configParams || [],
    getBooleanConfigParam('isLocalization'),
  ],
})

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
