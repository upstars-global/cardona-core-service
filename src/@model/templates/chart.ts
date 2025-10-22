import type { ChartOptions, ChartType, ScriptableContext } from 'chart.js'
import { amountFormatter } from '../../helpers/amount'
import config from "@/components/TextEditorWysiwyg/config";

export const ChartTypes: Record<string, ChartType> = {
  Line: 'line',
  Bar: 'bar',
} as const

export type AllowedChartType = typeof ChartTypes[keyof typeof ChartTypes]
export enum ChartInteractionMode {
  Point = 'point',
  Nearest = 'nearest',
  Index = 'index',
  Dataset = 'dataset',
  X = 'x',
  Y = 'y',
}

const ticksCallback = (value: number, isPercent?: boolean): string => isPercent ? `${value}%` : amountFormatter(value)

export const getChartConfig = (options: { chartType: AllowedChartType; isPercent?: boolean; tooltipMode?: ChartInteractionMode; yTicksCallback?: (value: string) => string }) => {
  const { chartType, isPercent, tooltipMode = ChartInteractionMode.Index, yTicksCallback } = options

  const tooltip = {
    mode: tooltipMode,
    intersect: true,
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

  const yTicks = {
    callback: (value: number) => yTicksCallback ? yTicksCallback(value) : ticksCallback(value, isPercent),
  }

  const grid = {
    display: true,
    color: '#E9E9F0',
  }

  const border = {
    dash: [4, 4],
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
          grid,
          border,
        },
        y: {
          stacked: true,
          ticks: yTicks,
          grid,
          border,
        },
      },
      hover: {
        mode: null,
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

      onHover: (event, activeElements, chart) => {
        if (activeElements.length) {
          const dataIndex = activeElements[0].index

          const newActive = chart.data.datasets.map((_, datasetIndex) => ({
            datasetIndex,
            index: dataIndex,
          }))

          chart.setActiveElements(newActive)
          chart.tooltip.setActiveElements(newActive)
        }
        else {
          chart.setActiveElements([])
          chart.tooltip.setActiveElements([])
        }
      },

      scales: {
        x: {
          ticks: xTicks,
          grid,
          border,
        },
        y: {
          ticks: yTicks,
          grid,
          border,
        },
      },
    },
  }

  return chartsOptions[chartType]
}
