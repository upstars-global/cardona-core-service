import type { ChartOptions, ChartType, ScriptableContext } from 'chart.js'
import { amountFormatter } from '../../helpers/amount'

export const ChartTypes: Record<string, ChartType> = {
  Line: 'line',
  Bar: 'bar',
} as const

export type AllowedChartType = typeof ChartTypes[keyof typeof ChartTypes]

const ticksCallback = (value: number, isPercent?: boolean): string => isPercent ? `${value}%` : amountFormatter(value)

export const getChartConfig = (options: { chartType: AllowedChartType; isPercent?: boolean }) => {
  const { chartType, isPercent } = options

  const tooltip = {
    mode: 'index',
    intersect: true,
    position: 'nearest',
  }

  const legend = {
    position: 'bottom',
    labels: {
      usePointStyle: true,
      pointStyle: 'circle',
      padding: 12,
    },
  }

  const xTicks = {
    autoSkip: false,
    maxRotation: 0,
    minRotation: 0,
    callback(this, _, index: number) {
      const labels = this.chart.data.labels as string[]

      return labels[index] ? labels[index].split(' ') : ''
    },
  }

  const chartsOptions: Record<AllowedChartType, ChartOptions<AllowedChartType>> = {
    [ChartTypes.Bar]: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend,
        tooltip,
      },
      scales: {
        x: {
          stacked: true,
          ticks: xTicks,
        },
        y: {
          stacked: true,
          ticks: {
            callback: (value: number) => ticksCallback(value, isPercent),
          },
        },
      },
    },

    [ChartTypes.Line]: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend,
        tooltip,
      },
      elements: {
        line: {
          tension: 0,
          borderColor: (ctx: ScriptableContext<typeof ChartTypes.Line>) => ctx.dataset.backgroundColor as string,
          borderWidth: 3,
          fill: false,
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
        },
        point: {
          radius: 3,
          hoverRadius: 5,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: xTicks,
        },
        y: {
          grid: {
            borderDash: [4, 4],
            color: '#E9ECEF',
          },
          ticks: {
            callback: (value: number) => ticksCallback(value, isPercent),
          },
        },
      },
    },
  }

  return chartsOptions[chartType]
}
