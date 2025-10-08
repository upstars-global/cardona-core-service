import type { BaseFieldConfig } from '../types'
import { ParamInputs } from '../types'

const getBaseConfigParam = (params: { key: string; input: ParamInputs; value: string | boolean | [] }) => params

export const getBooleanConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Boolean, value: false })
export const getTextConfigParam = (key: string) => getBaseConfigParam({ key, input: ParamInputs.Text, value: '' })
export const getSelectConfigParam = (key: string, value: Array<{ label: string; value: string }> = []) => getBaseConfigParam({ key, input: ParamInputs.Select, value })

export const getBaseConfig = (config: Record<string, unknown>): BaseFieldConfig => ({
  ...config,
  key: '',
  value: null,
  configParams: [
    // getBooleanConfigParam('label'),
    // getBooleanConfigParam('placeholder'),
    // getBooleanConfigParam('description'),
    getBooleanConfigParam('isLocalization'),
  ],
})
