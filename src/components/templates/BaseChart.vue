<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Chart } from 'chart.js'
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
  { deep: true },
)
</script>

<template>
  <canvas ref="canvasRef" />
</template>
