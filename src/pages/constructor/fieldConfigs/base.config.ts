import type { BaseFieldConfig, ConfigParams } from '../types'
import { ParamInputs } from '../types'

const getBaseConfigParam = (params: ConfigParams) => params

export const getBooleanConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Boolean, value: false })
export const getTextConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Text, value: '' })
export const getSelectConfigParam = (key: string, value: Array<{ label: string; value: string }> = []) => getBaseConfigParam({ key, input: ParamInputs.Select, value })

export const getBaseConfig = (config: Record<string, unknown>): BaseFieldConfig => ({
  ...config,
  key: '',
  value: null,
  i18nKeys: ['label', 'placeholder', 'info', 'description', 'other'],
  configParams: [
    ...config.options?.configParams || [],
    getBooleanConfigParam('isLocalization'),
  ],
})
