<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import type { AllowedChartType } from '../../@model/templates/chart'

const props = withDefaults(
  defineProps<{
    type: AllowedChartType
    chartData: ChartData<AllowedChartType>
    chartOptions?: ChartOptions<AllowedChartType>
    externalTooltipCb: Function
  }>(),
  {
    chartOptions: () => ({
      responsive: true,
    } as ChartOptions<AllowedChartType>),
  },
)

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
)

const chartContainer = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const tooltipEl = ref<HTMLElement | null>(null)
let chartInstance: Chart | null = null

const renderChart = () => {
  if (!canvasRef.value)
    return

  if (chartInstance)
    chartInstance?.destroy()

  chartInstance = new Chart(
    canvasRef.value!.getContext('2d')!,
    {
      type: props.type,
      data: props.chartData,
      options: {
        ...props.chartOptions,
        plugins: {
          ...props.chartOptions?.plugins,
          tooltip: {
            ...props.chartOptions?.plugins?.tooltip,
            enabled: !props.externalTooltipCb,
            external: context => props.externalTooltipCb && props.externalTooltipCb(context, tooltipEl, chartContainer.value!),
          },
        },
      },
    },
  )
}

onMounted(renderChart)

watch(
  () => [props.type, props.chartData, props.chartOptions],
  renderChart,
)
</script>

<template>
  <div
    ref="chartContainer"
    class="chart-container"
  >
    <canvas ref="canvasRef" />

    <div
      ref="tooltipEl"
      class="custom-tooltip"
    />
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  overflow: visible;
}
</style>
