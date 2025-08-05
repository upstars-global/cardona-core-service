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
