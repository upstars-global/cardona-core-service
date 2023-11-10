import { isNumber, isString } from 'lodash'
import { useRouter } from 'vue-router'
import { FieldInfo } from '../@model/field'
import { BaseField } from '../@model/templates/baseField'
import type { OptionsItem } from '../@model'
import { isObject } from '@core/utils'

export const isNullOrUndefinedValue = (value: any): boolean => value === null || value === undefined

export const transformFormData = (form): object => {
  return Object.entries(form).reduce((acc, [key, valueData]: [string, any]) => {
    if (valueData instanceof BaseField) {
      acc[key] = valueData.transformField()
    }
    else if (valueData instanceof FieldInfo) {
      // TODO: Delete after migration to BaseField
      acc[key] = Array.isArray(valueData.value)
        ? valueData.value.map(item => item.id || item)
        : valueData.value?.id ?? valueData.value ?? ''
    }
    else if (Array.isArray(valueData) && typeof valueData[0] !== 'string') {
      acc[key] = valueData
        .map(item =>
          item instanceof FieldInfo
            ? item.value
            : item instanceof BaseField
              ? item.transformField()
              : transformFormData(item),
        )
        .filter(item => !!item)
    }
    else if (isObject(valueData)) {
      const valueDataInner = JSON.parse(JSON.stringify(valueData))

      Object.keys(valueData).forEach(keyInner => {
        if (valueData[keyInner] instanceof FieldInfo) {
          valueDataInner[keyInner] = Array.isArray(valueData[keyInner].value)
            ? valueData[keyInner].value.map(item => item.id || item)
            : valueData[keyInner].value?.id ?? valueData[keyInner].value ?? ''
        }
        else {
          valueDataInner[keyInner] = valueData[keyInner]
        }
      })
      acc[key] = valueDataInner
    }
    else {
      acc[key] = valueData
    }

    return acc
  }, {})
}

export const convertCamelCase = (string: string, separator: string): string => {
  if (string.isEmpty)
    return string

  return (
    string[0].toLowerCase()
      + string.slice(1).replace(/[A-Z]/g, letter => `${separator}${letter.toLowerCase()}`)
  )
}

export const convertLowerCaseFirstSymbol = (string: string): string => {
  if (string.isEmpty)
    return string

  return string[0].toLowerCase() + string.slice(1)
}

export const convertUpperCaseFirstSymbol = (word: string): string => {
  if (!word)
    return ''

  return word[0].toUpperCase() + word.slice(1)
}

export const checkExistsPage = (pageName: string): boolean => {
  try {
    const router = useRouter()

    const routes = router.getRoutes()

    return !!routes.find(item => item.name === pageName)
  }
  catch (e) {
    return false
  }
}

export const convertDictionaryToOptions = (
  dictionary: Record<string, string>,
): Array<OptionsItem> => {
  return Object.entries(dictionary).map(
    ([id, name]) =>
      ({
        id,
        name,
      } as OptionsItem),
  )
}

interface permissionKeys {
  permissionKey: string
  permissionKeySeo: string
  permissionKeyReport: string
}

export const formatPermissionResponse = (basePermission: string): permissionKeys => {
  return {
    permissionKey: basePermission,
    permissionKeySeo: `${basePermission}-seo`,
    permissionKeyReport: `${basePermission}-report`,
  }
}
export const getPermissionKeys = (config: {
  permissionKey?: string
  permissionPrefix?: string
  entityNamePermission?: string
}): permissionKeys => {
  const { entityNamePermission } = config
  let { permissionKey = '', permissionPrefix = '' } = config

  if (!permissionKey && !entityNamePermission)
    throw new Error('No permission detected')

  if (permissionPrefix)
    permissionPrefix += '-'

  if (!permissionKey && entityNamePermission)
    permissionKey = convertCamelCase(entityNamePermission, '-')

  return formatPermissionResponse(permissionPrefix + permissionKey)
}

export const getShortString = (text: string | number, letterCount = 4): string => {
  const startString = String(text).slice(0, letterCount)
  const endString = String(text).slice(-letterCount)

  return `${startString}...${endString}`
}

export const isNotEmptyNumber = (number: any): boolean => isNumber(number) && !isNaN(number)
export const isEmptyString = (string: string): boolean => isString(string) && !string

export const getFileValue = (file: File): Promise<any> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function (e) {
      resolve(e.target?.result)
    }

    reader.onerror = function (error) {
      reject(error)
    }
    reader.readAsText(file)
  })

export const toPositiveNumbers = (value: NumberOrString): string =>
  value.toString().replace(/-/g, '')

export const toIntegerNumbers = (value: NumberOrString): string =>
  value.toString().replace(/[,.]/g, '')

export const getMappedValueByManyMethods = <T = NumberOrString>(
  value: T,
  mappedMethods: Array<Function>,
): T => mappedMethods.reduce((updatedValue, mappedMethod) => mappedMethod(updatedValue), value)
