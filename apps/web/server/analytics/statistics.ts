export interface AnalyticsSummary {
  count: number
  average: number | null
  median: number | null
  p25: number | null
  p50: number | null
  p75: number | null
  p90: number | null
  min: number | null
  max: number | null
}

export function percentileCont(values: number[], percentile: number) {
  if (values.length === 0) {
    return null
  }

  if (percentile < 0 || percentile > 1) {
    throw new RangeError("Percentile must be between 0 and 1")
  }

  const sorted = [...values].sort((left, right) => left - right)
  const position = (sorted.length - 1) * percentile
  const lowerIndex = Math.floor(position)
  const upperIndex = Math.ceil(position)

  if (lowerIndex === upperIndex) {
    return sorted[lowerIndex]
  }

  const fraction = position - lowerIndex
  return sorted[lowerIndex] + (sorted[upperIndex] - sorted[lowerIndex]) * fraction
}

export function summarizeValues(values: number[]): AnalyticsSummary {
  if (values.length === 0) {
    return {
      count: 0,
      average: null,
      median: null,
      p25: null,
      p50: null,
      p75: null,
      p90: null,
      min: null,
      max: null,
    }
  }

  const total = values.reduce((sum, value) => sum + value, 0)

  return {
    count: values.length,
    average: total / values.length,
    median: percentileCont(values, 0.5),
    p25: percentileCont(values, 0.25),
    p50: percentileCont(values, 0.5),
    p75: percentileCont(values, 0.75),
    p90: percentileCont(values, 0.9),
    min: Math.min(...values),
    max: Math.max(...values),
  }
}
