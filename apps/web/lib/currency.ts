const indianCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  currencyDisplay: "symbol",
  maximumFractionDigits: 0,
})

const compactNumberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 1,
})

export function formatDetailedCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—"
  }

  return indianCurrencyFormatter.format(value)
}

export function formatCompactCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—"
  }

  const absoluteValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""

  if (absoluteValue >= 10_000_000) {
    return `${sign}₹${compactNumberFormatter.format(absoluteValue / 10_000_000)}Cr`
  }

  if (absoluteValue >= 100_000) {
    return `${sign}₹${compactNumberFormatter.format(absoluteValue / 100_000)}L`
  }

  if (absoluteValue >= 1_000) {
    return `${sign}₹${compactNumberFormatter.format(absoluteValue / 1_000)}k`
  }

  return formatDetailedCurrency(value)
}
