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

const getCleanPhoneNumber = (numberPhone: string): string =>
  numberPhone[0] === '+' ? numberPhone.slice(1) : numberPhone

export const mappedCountryData = Object.entries(countries).map(
  ([shortCode, { phone, emoji, ...other }]) => ({
    ...other,
    shortCode,
    phone,
    flag: emoji,
  })
)

export const getCountryDataByPhone = (phoneNumber: string) =>
  mappedCountryData.find(({ phone }) => getCleanPhoneNumber(phoneNumber).indexOf(phone) === 0)
