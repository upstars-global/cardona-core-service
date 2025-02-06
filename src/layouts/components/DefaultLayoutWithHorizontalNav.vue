<script lang="ts" setup>
import { ref, watch } from 'vue'
import NavBarNotifications from '../../layouts/components/NavBarNotifications.vue'
import NavSearchBar from '../../layouts/components/NavSearchBar.vue'
import NavbarShortcuts from '../../layouts/components/NavbarShortcuts.vue'
import NavbarThemeSwitcher from '../../layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '../../layouts/components/UserProfile.vue'
import NavBarI18n from '../../@core/components/I18n.vue'
import { HorizontalNavLayout } from '../../@layouts'
import { VNodeRenderer } from '../../@layouts/components/VNodeRenderer'
import navItems from '../../navigation/apps-and-pages'
import { themeConfig } from '@themeConfig'

const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref<any>(null)

watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()

  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })
</script>

<template>
  <HorizontalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar>
      <RouterLink
        to="/"
        class="app-logo d-flex align-center gap-x-3"
      >
        <VNodeRenderer :nodes="themeConfig.app.logo" />

        <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
          {{ themeConfig.app.title }}
        </h1>
      </RouterLink>
      <VSpacer />

      <NavSearchBar trigger-btn-class="ms-lg-n3" />

      <NavBarI18n
        v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
        :languages="themeConfig.app.i18n.langConfig"
      />

      <NavbarThemeSwitcher />
      <NavbarShortcuts />
      <NavBarNotifications class="me-2" />
      <UserProfile />
    </template>

    <AppLoadingIndicator ref="refLoadingIndicator" />

    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Suspense
        :timeout="0"
        @fallback="isFallbackStateActive = true"
        @resolve="isFallbackStateActive = false"
      >
        <Component :is="Component" />
      </Suspense>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer />

    <!-- 👉 Customizer -->
  </HorizontalNavLayout>
</template>
