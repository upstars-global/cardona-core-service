<script setup lang="ts">
import LogisticsCardStatistics from '@/views/apps/logistics/LogisticsCardStatistics.vue'
import LogisticsDeliveryExpectations from '@/views/apps/logistics/LogisticsDeliveryExpectations.vue'
import LogisticsDeliveryPerformance from '@/views/apps/logistics/LogisticsDeliveryPerformance.vue'
import LogisticsOrderByCountries from '@/views/apps/logistics/LogisticsOrderByCountries.vue'
import LogisticsOverviewTable from '@/views/apps/logistics/LogisticsOverviewTable.vue'
import LogisticsShipmentStatistics from '@/views/apps/logistics/LogisticsShipmentStatistics.vue'
import LogisticsVehicleOverview from '@/views/apps/logistics/LogisticsVehicleOverview.vue'
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12">
      <LogisticsCardStatistics />
    </VCol>
    <VCol
      cols="12"
      md="6"
    >
      <LogisticsVehicleOverview />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <LogisticsShipmentStatistics />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <LogisticsDeliveryPerformance />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <LogisticsDeliveryExpectations />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
      <LogisticsOrderByCountries />
    </VCol>

    <VCol cols="12">
      <LogisticsOverviewTable />
    </VCol>
  </VRow>
</template>
