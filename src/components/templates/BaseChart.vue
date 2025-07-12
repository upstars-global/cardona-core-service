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

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const renderChart = () => {
  if (!canvasRef.value)
    return

  if (chartInstance)
    chartInstance?.destroy()

  chartInstance = new Chart(
    canvasRef.value.getContext('2d') as CanvasRenderingContext2D,
    {
      type: props.type,
      data: props.chartData,
      options: props.chartOptions,
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
  <canvas ref="canvasRef" />
</template>
