import { countries } from 'countries-list'

export default countries

export interface CountryData {
  readonly value: string
  readonly title: string
}

export interface ICountryItemData {
  shortCode: string
  phone: string
  flag: string
  capital: string
  continent: string
  currency: string
  emojiU: string
  languages: string[]
  name: string
  native: string
}

export const countriesSelect = Object.keys(countries).map(item => {
  return {
    value: item,
    title: countries[item].name,
  } as CountryData
})

export const allPhoneCodesWithFlags = Object.values(countries).map(({ phone, emoji }) => ({
  phone,
  flag: emoji,
}))

const getCleanPhoneNumber = (numberPhone: string): string =>
  numberPhone[0] === '+' ? numberPhone.slice(1) : numberPhone

export const mappedCountryData = Object.entries(countries).map(
  ([shortCode, { phone, emoji, ...other }]) => ({
    ...other,
    shortCode,
    phone,
    flag: emoji,
  }),
)

export const getCountryDataByPhone = (phoneNumber: string): ICountryItemData | undefined =>
  mappedCountryData.find(({ phone }) => getCleanPhoneNumber(phoneNumber).indexOf(phone) === 0)
