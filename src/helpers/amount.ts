import { division } from './math-operations'

const THOUSAND = 1_000
const TEN_THOUSANDS = 10_000
const MILLION = 1_000_000

export const amountFormatter = (value: string | number): string => {
  const rawValue = Number(value)
  const sign = rawValue < 0 ? '-' : ''
  const absValue = Math.abs(rawValue)

  if (absValue >= MILLION) {
    const millions = absValue / MILLION

    const formattedMillions = millions % 1 === 0
      ? String(millions)
      : millions.toFixed(1)

    return `${sign}${formattedMillions}M`
  }

  if (absValue >= TEN_THOUSANDS) {
    const thousands = absValue / THOUSAND

    const formattedThousands = thousands % 1 === 0
      ? String(thousands)
      : thousands.toFixed(1)

    return `${sign}${formattedThousands}K`
  }

  return `${rawValue}`
}

export const prepareDisplayedAmount = (value: string | number, currency?: string, options: Intl.NumberFormatOptions = {}): string => {
  let number = typeof value === 'number' ? value : Number(value)

  if (currency) {
    number = division(value, 100)

    options = { minimumFractionDigits: 2, maximumFractionDigits: 2, ...options }
  }

  const formattedNumber = new Intl.NumberFormat('uk-UA', options).format(number)

  return currency ? `${formattedNumber}\u00A0${currency}` : formattedNumber
}
