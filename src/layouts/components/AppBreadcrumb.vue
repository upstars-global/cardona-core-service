<script setup>
import { computed } from 'vue'

import { useRoute } from 'vue-router'

import { IconsList } from '../../@model/enums/icons'
import { VVariants } from '../../@model/vuetify'
import { useLayoutConfigStore } from '@layouts/stores/config'

const route = useRoute()

const allBreadcrumb = computed(() => [{ to: '/' }, ...route.meta.breadcrumb])

const layoutConfig = useLayoutConfigStore()
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
          cols="12"
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
          <h2 class="content-header-title float-left pr-1 mb-0">
            {{ $t(`title.${$route.meta.title}`) }}
          </h2>
          <div class="breadcrumb-wrapper">
            <VBreadcrumbs :items="allBreadcrumb">
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
                    {{ $t(`title.${item.title}`) }}
                  </template>
                  <template v-else>
                    <VIcon :icon="IconsList.HomeIcon" />
                  </template>
                </RouterLink>
              </template>
            </VBreadcrumbs>
          </div>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
