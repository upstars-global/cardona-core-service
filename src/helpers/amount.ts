import { division } from './math-operations'

const THOUSAND = 1_000
const TEN_THOUSANDS = 10_000
const MILLION = 1_000_000

/**
 * Compacts a large numeric amount into a short human-readable string.
 *
 * @param value — raw numeric amount (string or number)
 * @returns compact string with suffix: `'1.5M'`, `'25K'`, or plain number for values < 10 000
 *
 * @example
 * amountFormatter(1_500_000)  // → '1.5M'
 * amountFormatter(25_000)     // → '25K'
 * amountFormatter(9_999)      // → '9999'
 * amountFormatter(-3_000_000) // → '-3M'
 */
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

/**
 * Formats a numeric amount for display using the `uk-UA` locale.
 *
 * When `currency` is provided, `value` is treated as the smallest currency unit (cents/kopecks)
 * and divided by 100 using precision arithmetic (`decimal.js`) before formatting.
 * The currency code is appended with a non-breaking space.
 *
 * @param value — raw amount; treated as cents when `currency` is set, otherwise a plain number
 * @param currency — ISO 4217 code to append (e.g. `'UAH'`, `'USD'`); omit to format without suffix
 * @param options — `Intl.NumberFormat` overrides; defaults to 2 decimal places when `currency` is set
 * @returns locale-formatted string, e.g. `'1 500,00\u00A0UAH'` or `'1 234,5'`
 *
 * @example
 * prepareDisplayedAmount(150000, 'UAH')  // → '1 500,00 UAH'
 * prepareDisplayedAmount(1234.5)         // → '1 234,5'
 */
export const prepareDisplayedAmount = (value: string | number, currency?: string, options: Intl.NumberFormatOptions = {}): string => {
  let number = typeof value === 'number' ? value : Number(value)

  if (currency) {
    number = division(value, 100)

    options = { minimumFractionDigits: 2, maximumFractionDigits: 2, ...options }
  }

  const formattedNumber = new Intl.NumberFormat('uk-UA', options).format(number)

  return currency ? `${formattedNumber}\u00A0${currency}` : formattedNumber
}
