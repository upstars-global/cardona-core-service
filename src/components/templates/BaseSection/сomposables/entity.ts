import { convertCamelCase } from '../../../../helpers'

export const generateEntityUrl = (entityName: string): string => {
  const indexSymbolNextDash = entityName.indexOf('-') + 1

  const entityNameForLoad = entityName.replace(
    entityName[indexSymbolNextDash],
    entityName[indexSymbolNextDash].toLowerCase(),
  )

  return convertCamelCase(entityNameForLoad, '/')
}
