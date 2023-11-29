<script setup lang="ts">
import AcademyAssignmentProgress from '@/views/apps/academy/AcademyAssignmentProgress.vue'
import AcademyCardPopularInstructors from '@/views/apps/academy/AcademyCardPopularInstructors.vue'
import AcademyCardTopCourses from '@/views/apps/academy/AcademyCardTopCourses.vue'
import AcademyCourseTable from '@/views/apps/academy/AcademyCourseTable.vue'
import AcademyUpcomingWebinar from '@/views/apps/academy/AcademyUpcomingWebinar.vue'

const borderColor = 'rgba(var(--v-border-color), var(--v-border-opacity))'

// Topics Charts config
const topicsChartConfig = {
  chart: {
    height: 270,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },

  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '70%',
      distributed: true,
      startingShape: 'rounded',
      borderRadius: 7,
    },
  },

  colors: [
    '#7367f0', '#16B1FF', '#56CA00', '#8A8D93', '#FF4C51', '#FFB400',
  ],

  grid: {
    borderColor,
    strokeDashArray: 10,
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: false,
      },
    },
    padding: {
      top: -35,
      bottom: -12,
    },
  },

  dataLabels: {
    enabled: true,
    style: {
      colors: ['#fff'],
      fontWeight: 200,
      fontSize: '13px',

    },
    offsetX: 0,
    dropShadow: {
      enabled: false,
    },
    formatter(val: string, opt: any) {
      return topicsChartConfig.labels[opt.dataPointIndex]
    },
  },
  labels: ['UI Design', 'UX Design', 'Music', 'Animation', 'Vue', 'SEO'],

  xaxis: {
    categories: ['6', '5', '4', '3', '2', '1'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
      formatter(val: string) {
        return `${val}%`
      },
    },
  },

  yaxis: {
    max: 35,
    labels: {
      style: {
        colors: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
        fontSize: '13px',
      },
    },
  },

  tooltip: {
    enabled: true,
    style: {
      fontSize: '12px',
    },
    onDatasetHover: {
      highlightDataSeries: false,
    },
  },
  legend: {
    show: false,
  },

}

const topicsChartSeries = [
  {
    data: [35, 20, 14, 12, 10, 9],
  },
]

// Donut Chart Colors
const donutChartColors = {
  donut: {
    series1: '#22A95E',
    series2: '#24B364',
    series3: '#56CA00',
    series4: '#53D28C',
    series5: '#7EDDA9',
    series6: '#A9E9C5',
  },
}

// Donuts Chart Config
const timeSpendingChartConfig = {
  chart: {
    height: 157,
    width: 130,
    parentHeightOffset: 0,
    type: 'donut',
  },
  labels: ['36h', '56h', '16h', '32h', '56h', '16h'],
  colors: [
    donutChartColors.donut.series1,
    donutChartColors.donut.series2,
    donutChartColors.donut.series3,
    donutChartColors.donut.series4,
    donutChartColors.donut.series5,
    donutChartColors.donut.series6,
  ],
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: false,
    formatter(val: string) {
      return `${Number.parseInt(val)}%`
    },
  },
  legend: {
    show: false,
  },
  tooltip: {
    theme: false,
  },
  grid: {
    padding: {
      top: 0,
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          value: {
            fontSize: '1.5rem',
            color: 'rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))',
            fontWeight: 500,
            offsetY: -15,
            formatter(val: string) {
              return `${Number.parseInt(val)}%`
            },
          },
          name: {
            offsetY: 20,
          },
          total: {
            show: true,
            fontSize: '.7rem',
            label: 'Total',
            color: 'rgba(var(--v-theme-on-background), var(--v-disabled-opacity))',
            formatter() {
              return '231h'
            },
          },
        },
      },
    },
  },
}

const timeSpendingChartSeries = [23, 35, 10, 20, 35, 23]

const topicsData = [
  { title: 'UI Design', value: 35, color: 'primary' },
  { title: 'UX Design', value: 20, color: 'info' },
  { title: 'Music', value: 14, color: 'success' },
  { title: 'Animation', value: 12, color: 'secondary' },
  { title: 'Vue', value: 10, color: 'error' },
  { title: 'SEO', value: 9, color: 'warning' },
]
</script>

<template>
  <div>
    <VRow class="py-6">
      <!-- 👉 Welcome -->
      <VCol
        cols="12"
        md="8"
        :class="$vuetify.display.mdAndUp ? 'border-e' : 'border-b'"
      >
        <div class="pe-3">
          <h3 class="text-h3 text-high-emphasis mb-1">
            Welcome back,<span class="font-weight-medium"> Felecia 👋🏻 </span>
          </h3>

          <div
            class="mb-2 text-wrap"
            style="max-inline-size: 400px;"
          >
            Your progress this week is Awesome. let's keep it up
            and get a lot of points reward!
          </div>

          <div class="d-flex justify-space-between flex-wrap gap-4 flex-column flex-md-row">
            <div
              v-for="{ title, value, icon, color } in [
                { title: 'Hours Spent', value: '34h', icon: 'custom-laptop', color: 'primary' },
                { title: 'Test Results', value: '82%', icon: 'custom-lightbulb', color: 'info' },
                { title: 'Course Completed', value: '14', icon: 'custom-check', color: 'warning' },
              ]"
              :key="title"
            >
              <div class="d-flex">
                <VAvatar
                  variant="tonal"
                  :color="color"
                  rounded
                  size="54"
                  class="text-primary me-4"
                >
                  <VIcon
                    :icon="icon"
                    size="38"
                  />
                </VAvatar>
                <div>
                  <span class="text-base">{{ title }}</span>
                  <h4
                    class="text-h4 font-weight-medium"
                    :class="`text-${color}`"
                  >
                    {{ value }}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VCol>

      <!-- 👉 Time Spendings -->
      <VCol
        cols="12"
        md="4"
      >
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex flex-column ps-3">
            <h5 class="text-h5 text-high-emphasis mb-2 text-no-wrap">
              Time Spendings
            </h5>
            <span class="mb-7">Weekly Report</span>
            <div class="text-h3 mb-2">
              231<span class="text-h4 text-medium-emphasis">h</span> 14<span class="text-h4 text-medium-emphasis">m</span>
            </div>
            <div>
              <VChip
                color="success"
                label
              >
                +18.4%
              </VChip>
            </div>
          </div>
          <div>
            <VueApexCharts
              type="donut"
              height="150"
              width="150"
              :options="timeSpendingChartConfig"
              :series="timeSpendingChartSeries"
            />
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow class="match-height">
      <!-- 👉 Topics you are interested in -->
      <VCol
        cols="12"
        md="8"
      >
        <!-- 👉 Topic You are Interested in -->
        <VCard>
          <VCardItem title="Topic you are interested in">
            <template #append>
              <MoreBtn />
            </template>
          </VCardItem>

          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <div>
                  <VueApexCharts
                    type="bar"
                    height="260"
                    :options="topicsChartConfig"
                    :series="topicsChartSeries"
                  />
                </div>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <div
                  class="d-flex flex-wrap gap-x-4 gap-y-10 mx-auto"
                  style="inline-size: 300px;"
                >
                  <div
                    v-for="topic in topicsData"
                    :key="topic.title"
                    class="d-flex gap-x-4"
                  >
                    <VBadge
                      dot
                      inline
                      class="mt-1 custom-badge"
                      :color="topic.color"
                    />
                    <div>
                      <div
                        class="text-body-1"
                        style="min-inline-size: 90px;"
                      >
                        {{ topic.title }}
                      </div>
                      <h4 class="text-h4">
                        {{ topic.value }}%
                      </h4>
                    </div>
                  </div>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Popular Instructors  -->
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <AcademyCardPopularInstructors />
      </VCol>

      <!-- 👉 Academy Top Courses  -->
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <AcademyCardTopCourses />
      </VCol>

      <!-- 👉 Academy Upcoming Webinar -->
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <AcademyUpcomingWebinar />
      </VCol>

      <!-- 👉 Academy Assignment Progress  -->
      <VCol
        cols="12"
        md="4"
        sm="6"
      >
        <AcademyAssignmentProgress />
      </VCol>

      <!-- 👉 Academy Course Table  -->
      <VCol>
        <AcademyCourseTable />
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
