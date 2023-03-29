import { useRouter } from '../@core/utils/utils'
import { FieldInfo } from '../@model/field'
import { BaseField } from '../@model/baseField'
import { OptionsItem } from '../@model'

export const isNullOrUndefinedValue = (value: any): boolean => value === null || value === undefined

export const transformFormData = (form): object => {
  return Object.entries(form).reduce((acc, [key, valueData]: [string, any]) => {
    if (valueData instanceof BaseField) {
      acc[key] = valueData.transformField()
    } else if (valueData instanceof FieldInfo) {
      // TODO: Delete after migration to BaseField
      acc[key] = Array.isArray(valueData.value)
        ? valueData.value.map((item) => item.id || item)
        : valueData.value?.id ?? valueData.value ?? ''
    } else if (Array.isArray(valueData) && typeof valueData[0] !== 'string') {
      acc[key] = valueData
        .map((item) => (item instanceof FieldInfo ? item.value : transformFormData(item)))
        .filter((item) => !!item)
    } else {
      acc[key] = valueData
    }

    return acc
  }, {})
}

export const convertCamelCase = (string: string, separator: string): string =>
  string[0].toLowerCase() +
  string.slice(1).replace(/[A-Z]/g, (letter) => `${separator}${letter.toLowerCase()}`)

export const convertLowerCaseFirstSymbol = (string: string): string =>
  string[0].toLowerCase() + string.slice(1)

export const convertUpperCaseFirstSymbol = (word: string): string =>
  word[0].toUpperCase() + word.slice(1)

export const checkExistsPage = (pageName: string): boolean => {
  const { router } = useRouter()
  const { route } = router.resolve({ name: pageName })

  return route.matched.isNotEmpty
}

export const convertDictionaryToOptions = (
  dictionary: Record<string, string>
): Array<OptionsItem> => {
  return Object.entries(dictionary).map(
    ([id, name]) =>
      ({
        id,
        name,
      } as OptionsItem)
  )
}
