export const getVariablesFromLocale = (localeText: string): Array<string> => {
  const regex = /\{([^}]+)\}/g
  const matches = localeText.match(regex)
  return matches?.map((match) => match.slice(1, -1)) || []
}
