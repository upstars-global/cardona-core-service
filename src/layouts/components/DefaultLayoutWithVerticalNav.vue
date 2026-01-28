<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import AppLoadingIndicator from '../../components/AppLoadingIndicator.vue'
import NotificationExport from '../../components/NotificationExport/index.vue'
import { useUserStore } from '../../stores/user'
import AppBreadcrumb from './AppBreadcrumb.vue'
import { useAppsAndPages } from '@/navigation/vertical/apps-and-pages'
import { VerticalNavLayout } from '@layouts'

const userStore = useUserStore()

const { appsAndPages } = useAppsAndPages()

const navItems = computed(() => {
  return appsAndPages.value
})

const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })

// Notifications export
const canShowNotificationExport = computed(() => userStore.haveSomePermissionReport)

const userId = computed(() => userStore.userInfo.id)
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <AppBreadcrumb>
        <template #content-right="{ time }">
          <VDivider
            v-if="canShowNotificationExport"
            class="mx-4"
            vertical
          />

          <div
            v-if="canShowNotificationExport"
            cols="1"
            class="d-flex align-center justify-end notification-export-wrapper"
          >
            <NotificationExport
              :time="time"
              :user-id="userId"
            />
          </div>
        </template>
      </AppBreadcrumb>
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <slot :is-fallback-state-active="isFallbackStateActive">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition
            name="zoom-fade"
            mode="out-in"
          >
            <Suspense
              :timeout="0"
              @fallback="isFallbackStateActive = true"
              @resolve="isFallbackStateActive = false"
            >
              <component :is="Component" />
            </Suspense>
          </Transition>
        </template>
      </RouterView>
    </slot>

    <!-- 👉 Footer -->
    <template #footer>
      <slot name="footer" />
    </template>

    <!-- 👉 Customizer -->
  </VerticalNavLayout>
</template>
