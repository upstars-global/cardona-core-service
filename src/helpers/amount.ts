const THOUSAND = 1_000
const TEN_THOUSANDS = 10_000
const MILLION = 1_000_000

export const amountFormatter = (value: string | number): string => {
  const rawValue = Number(value)

  if (rawValue >= MILLION) {
    const millions = rawValue / MILLION

    const formattedMillions
      = millions % 1 === 0 ? millions : millions.toFixed(1)

    return `${formattedMillions}M`
  }

  if (rawValue >= TEN_THOUSANDS) {
    const thousands = rawValue / THOUSAND

    const formattedThousands
      = thousands % 1 === 0 ? thousands : thousands.toFixed(1)

    return `${formattedThousands}K`
  }

  return rawValue.toString()
}
