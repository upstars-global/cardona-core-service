<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useStore } from 'vuex'

import { IconsList } from '../../@model/enums/icons'
import { VVariants } from '../../@model/vuetify'
import { useClockUtc } from '../../use/useClockUtc'
import { useLayoutConfigStore } from '@layouts/stores/config'

const route = useRoute()
const store = useStore()

const { t } = useI18n()

const allBreadcrumb = computed(() => {
  const breadcrumbs = route.meta.breadcrumb
    ? typeof route.meta.breadcrumb === 'function'
      ? route.meta.breadcrumb(route)
      : route.meta.breadcrumb
    : []

  return [{ to: '/', disabled: false }, ...breadcrumbs]
})

const layoutConfig = useLayoutConfigStore()

const clock = useClockUtc({ isUtc: true })

const time = computed(() => clock.time.value)

onMounted(clock.runTime)
onUnmounted(clock.stopTime)

const pageTitle = computed(() => t(`title.${route.meta.title}`))
const breadCrumbTitle = computed(() => `${pageTitle.value} | ${store.getters.selectedProject.name} | Backoffice`)

useTitle(breadCrumbTitle)
</script>

<template>
  <VRow
    v-if="$route.meta.breadcrumb || $route.meta.title"
    no-gutters
    class="content-header"
  >
    <VCol
      class="content-header-left"
      cols="12"
    >
      <VRow
        no-gutters
        class="breadcrumbs-top"
      >
        <VCol
          cols="10"
          class="d-flex align-center"
        >
          <VBtn
            size="28"
            class="d-lg-none mr-4"
            :variant="VVariants.Text"
            @click="layoutConfig.toggleMenu"
          >
            <VIcon
              size="24"
              :icon="IconsList.Menu2Icon"
            />
          </VBtn>
          <h4 class="float-left mb-0 text-h4 breadcrumb-title">
            {{ pageTitle }}
          </h4>
          <div class="breadcrumb-wrapper">
            <VBreadcrumbs
              :items="allBreadcrumb"
              class="text-body-1"
            >
              <template #divider>
                <VIcon :icon="IconsList.ChevronRightIcon" />
              </template>
              <template #title="{ index, item }">
                <template v-if="item.active">
                  {{ $t(`title.${item.title}`) }}
                </template>
                <RouterLink
                  v-else
                  :to="item.to"
                  class="d-flex"
                >
                  <template v-if="index">
                    {{ $t(`title.${item.title || item.text}`) }}
                  </template>
                  <template v-else>
                    <VIcon
                      :icon="IconsList.HomeIcon"
                      size="20"
                    />
                  </template>
                </RouterLink>
              </template>
            </VBreadcrumbs>
          </div>
        </VCol>
        <VCol
          cols="2"
          class="d-flex align-center justify-end text-body-1"
        >
          <div class="mr-1 text-color-mute">
            <VIcon :icon="IconsList.ClockIcon" />
          </div>
          <div class="time-value mt-1 mr-1">
            {{ time }}
          </div>
          <div class="mt-1">
            UTC
          </div>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.time-value {
  width: 60px;
}

.breadcrumb-title {
  color: rgb(var(--v-theme-grey-900));
}

.breadcrumb-wrapper {
  padding-left: 1rem;
  :deep(ul) {
    padding-inline: 0;
  }
}
</style>
