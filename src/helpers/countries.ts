import { countries } from 'countries-list'

export default countries

export type CountryData = {
  readonly value: string
  readonly title: string
}

export const countriesSelect = Object.keys(countries).map((item) => {
  return {
    value: item,
    title: countries[item].name,
  } as CountryData
})

export const allPhoneCodesWithFlags = Object.values(countries).map(({ phone, emoji }) => ({
  phone,
  flag: emoji,
}))
