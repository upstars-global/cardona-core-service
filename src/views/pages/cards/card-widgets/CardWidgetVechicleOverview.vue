<script setup lang="ts">
const vehicleData = [
  { icon: 'tabler-truck', title: 'On the way', time: '2hr 10min', percentage: 39.7 },
  { icon: 'tabler-circle-arrow-down', title: 'Unloading', time: '3hr 15min', percentage: 28.3 },
  { icon: 'tabler-circle-arrow-up', title: 'Loading', time: '1hr 24min', percentage: 17.4 },
  { icon: 'tabler-clock', title: 'Waiting', time: '5hr 19min', percentage: 14.6 },
]
</script>

<template>
  <VCard>
    <VCardItem title="Vehicles Overview">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>
    <VCardText>
      <div class="d-flex mb-8">
        <div style="inline-size: 39.7%;">
          <div class="vehicle-progress-label position-relative mb-4 text-body-1 d-none d-sm-block">
            On the way
          </div>
          <VProgressLinear
            color="rgba(var(--v-theme-on-surface), var(--v-hover-opacity))"
            model-value="100"
            height="46"
            class="rounded-e-0 rounded-sm"
          >
            <strong class="text-start vehicle-progress-text">39.7%</strong>
          </VProgressLinear>
        </div>
        <div style="inline-size: 28.3%;">
          <div class="vehicle-progress-label position-relative mb-4 text-body-1 d-none d-sm-block">
            Unloading
          </div>
          <VProgressLinear
            color="rgb(var(--v-theme-primary))"
            model-value="100"
            class="rounded-0"
            height="46"
          >
            <strong class="text-white vehicle-progress-text">28.3%</strong>
          </VProgressLinear>
        </div>
        <div style="inline-size: 17.4%;">
          <div class="vehicle-progress-label position-relative mb-4 text-body-1 d-none d-sm-block">
            Loading
          </div>
          <VProgressLinear
            color="rgb(var(--v-theme-info))"
            model-value="100"
            height="46"
            class="rounded-0"
          >
            <strong class="text-white vehicle-progress-text">17.4%</strong>
          </VProgressLinear>
        </div>
        <div style="inline-size: 14.6%;">
          <div class="vehicle-progress-label position-relative mb-4 text-body-1 d-none d-sm-block">
            Waiting
          </div>
          <VProgressLinear
            color="#212121"
            model-value="100"
            height="46"
            class="rounded-s-0 rounded-sm"
          >
            <strong class="text-white vehicle-progress-text">14.6%</strong>
          </VProgressLinear>
        </div>
      </div>
      <VTable class="text-no-wrap">
        <tbody>
          <tr
            v-for="(vehicle, index) in vehicleData"
            :key="index"
          >
            <td width="70%">
              <VIcon
                :icon="vehicle.icon"
                size="24"
                class="me-2"
              />
              <span class="text-body-1 text-high-emphasis">{{ vehicle.title }}</span>
            </td>
            <td>
              <div class="font-weight-medium text-body-1 text-high-emphasis">
                {{ vehicle.time }}
              </div>
            </td>
            <td>
              <span class="text-body-1">{{ vehicle.percentage }}%</span>
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.vehicle-progress-label {
  padding-block-end: 1rem;

  &::after {
    position: absolute;
    display: inline-block;
    background-color: #DBDADE;
    block-size: 10px;
    content: "";
    inline-size: 2px;
    inset-block-end: 0;
    inset-inline-start: 0;

    [dir="rtl"] & {
      inset-inline: unset 0;
    }
  }
}
</style>

<style lang="scss">
.v-progress-linear__content {
  justify-content: start;
  padding-inline-start: 1rem;

  .vehicle-progress-text {
    font-size: 1rem;
  }
}

@media (max-width: 1080px) {
  .v-progress-linear__content {
    padding-inline-start: 0.75rem !important;

    .vehicle-progress-text {
      font-size: 0.75rem !important;
    }
  }
}

@media (max-width: 576px) {
  .v-progress-linear__content {
    padding-inline-start: 0.3rem !important;

    .vehicle-progress-text {
      font-size: 0.75rem !important;
    }
  }
}
</style>
