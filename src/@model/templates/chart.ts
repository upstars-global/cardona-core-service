import type { ChartType } from 'chart.js'

export const ChartTypes: Record<string, ChartType> = {
  Line: 'line',
  Bar: 'bar',
} as const

export type AllowedChartType = typeof ChartTypes[keyof typeof ChartTypes]
