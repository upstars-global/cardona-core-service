<script setup lang="ts">
const currentTab = ref('New')
const tabsData = ['New', 'Preparing', 'Shipping']
</script>

<template>
  <VCard class="country-order-card">
    <VCardItem
      title="Orders by countries"
      subtitle="62 deliveries in progress"
    >
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>

    <VTabs
      v-model="currentTab"
      grow
      class="disable-tab-transition"
    >
      <VTab
        v-for="(tab, index) in tabsData"
        :key="index"
      >
        {{ tab }}
      </VTab>
    </VTabs>

    <VCardText>
      <VWindow v-model="currentTab">
        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
            >
              <VTimelineItem
                icon="tabler-circle-check"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="app-timeline-text">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="tabler-map-pin"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="app-timeline-text">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>
            </VTimeline>
            <VDivider
              class="my-5"
              style="border-style: dashed;"
            />
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
            >
              <VTimelineItem
                icon="tabler-circle-check"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="app-timeline-text">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="tabler-map-pin"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="app-timeline-text">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>

        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
            >
              <VTimelineItem
                icon="tabler-circle-check"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="app-timeline-text">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="tabler-map-pin"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="app-timeline-text">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>
            </VTimeline>

            <VDivider class="my-6" />

            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
            >
              <VTimelineItem
                icon="tabler-circle-check"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="app-timeline-text">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="tabler-map-pin"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="app-timeline-text">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>

        <VWindowItem>
          <div>
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
            >
              <VTimelineItem
                icon="tabler-circle-check"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Myrtle Ullrich
                </div>
                <div class="app-timeline-text">
                  101 Boulder, California(CA), 95959
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="tabler-map-pin"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Barry Schowalter
                </div>
                <div class="app-timeline-text">
                  939 Orange, California(CA), 92118
                </div>
              </VTimelineItem>
            </VTimeline>
            <VDivider class="my-6" />
            <VTimeline
              align="start"
              truncate-line="both"
              side="end"
              density="compact"
              line-thickness="1"
            >
              <VTimelineItem
                icon="tabler-circle-check"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="success"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-uppercase text-success">
                  Sender
                </div>
                <div class="app-timeline-title">
                  Veronica Herman
                </div>
                <div class="app-timeline-text">
                  162  Windsor, California(CA), 95492
                </div>
              </VTimelineItem>
              <VTimelineItem
                icon="tabler-map-pin"
                dot-color="rgba(var(--v-theme-surface))"
                icon-color="primary"
                fill-dot
                size="22"
                :elevation="0"
              >
                <div class="text-caption text-primary text-uppercase">
                  Receiver
                </div>
                <div class="app-timeline-title">
                  Helen Jacobs
                </div>
                <div class="app-timeline-text">
                  487 Sunset, California(CA), 94043
                </div>
              </VTimelineItem>
            </VTimeline>
          </div>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.country-order-card{
  .v-timeline .v-timeline-divider__dot .v-timeline-divider__inner-dot{
    box-shadow: none !important;
  }
}
</style>
