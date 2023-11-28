<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router/auto'
import { useDisplay } from 'vuetify'

import { useWindowScroll } from '@vueuse/core'
import navImg from '@images/front-pages/misc/nav-item-col-img.png'

import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const props = defineProps({
  activeId: String,
})

const display = useDisplay()

interface navItem {
  name: string
  to: RouteLocationRaw
}

interface MenuItem {
  listTitle: string
  listIcon: string
  navItems: navItem[]
}
const { y } = useWindowScroll()

const route = useRoute()
const router = useRouter()

const sidebar = ref(false)

watch(() => display, () => {
  return display.mdAndUp ? sidebar.value = false : sidebar.value
}, { deep: true })

const isMenuOpen = ref(false)
const isMegaMenuOpen = ref(false)

const menuItems: MenuItem[] = [
  {
    listTitle: 'Page',
    listIcon: 'tabler-layout-grid',
    navItems: [
      { name: 'Pricing', to: { name: 'front-pages-pricing' } },
      { name: 'Payment', to: { name: 'front-pages-payment' } },
      { name: 'Checkout', to: { name: 'front-pages-checkout' } },
      { name: 'Help Center', to: { name: 'front-pages-help-center' } },
    ],
  },
  {
    listTitle: 'Auth Demo',
    listIcon: 'tabler-lock-open',
    navItems: [
      { name: 'Login (Basic)', to: { name: 'pages-authentication-login-v1' } },
      { name: 'Login (Cover)', to: { name: 'pages-authentication-login-v2' } },
      { name: 'Register (Basic)', to: { name: 'pages-authentication-register-v1' } },
      { name: 'Register (Cover)', to: { name: 'pages-authentication-register-v2' } },
      { name: 'Register (Multi-steps)', to: { name: 'pages-authentication-register-multi-steps' } },
      { name: 'Forgot Password (Basic)', to: { name: 'pages-authentication-forgot-password-v1' } },
      { name: 'Forgot Password (Cover)', to: { name: 'pages-authentication-forgot-password-v2' } },
      { name: 'Reset Password (Basic)', to: { name: 'pages-authentication-reset-password-v1' } },
      { name: 'Reset Password (cover  )', to: { name: 'pages-authentication-reset-password-v2' } },
    ],
  },
  {
    listTitle: 'Other',
    listIcon: 'tabler-photo',
    navItems: [
      { name: 'Under Maintenance', to: { name: 'pages-misc-under-maintenance' } },
      { name: 'Coming Soon', to: { name: 'pages-misc-coming-soon' } },
      { name: 'Not Authorized', to: { path: '/not-authorized' } },
      { name: 'Verify Email (Basic)', to: { name: 'pages-authentication-verify-email-v1' } },
      { name: 'Verify Email (Cover)', to: { name: 'pages-authentication-verify-email-v2' } },
      { name: 'Two Steps (Basic)', to: { name: 'pages-authentication-two-steps-v1' } },
      { name: 'Two Steps (Cover)', to: { name: 'pages-authentication-two-steps-v2' } },
    ],
  },
]

const isCurrentRoute = (to: RouteLocationRaw) => {
  return route.matched.some(_route => _route.path === router.resolve(to).path)
}

const isPageActive = computed(() => menuItems.some(item => item.navItems.some(listItem => isCurrentRoute(listItem.to))))
</script>

<template>
  <!-- 👉 Navigation drawer for mobile devices  -->
  <VNavigationDrawer
    v-model="sidebar"
    width="275"
    disable-resize-watcher
  >
    <!-- Nav items -->
    <div>
      <div class="d-flex flex-column gap-y-4 pa-4">
        <RouterLink
          v-for="(item, index) in ['Home', 'Features', 'Team', 'FAQ', 'Contact us']"
          :key="index"
          :to="{ name: 'front-pages-landing-page', hash: `#${item.toLowerCase().replace(' ', '-')}` }"
          class="nav-link font-weight-medium"
          :class="[props.activeId?.toLocaleLowerCase().replace('-', ' ') === item.toLocaleLowerCase() ? 'active-link' : '']"
        >
          {{ item }}
        </RouterLink>

        <div class="font-weight-medium cursor-pointer">
          <div
            :class="[isMenuOpen ? 'mb-6 active-link' : '', isPageActive ? 'active-link' : '']"
            style="color: rgba(var(--v-theme-on-surface))"
            class="page-link"
            @click="isMenuOpen = !isMenuOpen"
          >
            Pages <VIcon :icon="isMenuOpen ? 'tabler-chevron-up' : 'tabler-chevron-down'" />
          </div>

          <div
            class="px-4"
            :class="isMenuOpen ? 'd-block' : 'd-none'"
          >
            <div
              v-for="(item, index) in menuItems"
              :key="index"
            >
              <div class="d-flex align-center gap-x-3 mb-4">
                <VAvatar
                  variant="tonal"
                  color="primary"
                  rounded
                  :icon="item.listIcon"
                />
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  {{ item.listTitle }}
                </div>
              </div>
              <ul class="mb-6">
                <li
                  v-for="listItem in item.navItems"
                  :key="listItem.name"
                  style="list-style: none;"
                  class="text-body-1 mb-4 text-no-wrap"
                >
                  <RouterLink
                    :to="listItem.to"
                    :target="item.listTitle === 'Page' ? '_self' : '_blank'"
                    class="mega-menu-item"
                    :class="isCurrentRoute(listItem.to) ? 'active-link' : 'text-high-emphasis'"
                  >
                    <VIcon
                      icon="tabler-circle"
                      :size="10"
                      class="me-2"
                    />
                    <span>  {{ listItem.name }}</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <RouterLink
          to="/"
          target="_blank"
          class="font-weight-medium nav-link"
        >
          Admin
        </RouterLink>
      </div>
    </div>

    <!-- Navigation drawer close icon -->
    <VIcon
      id="navigation-drawer-close-btn"
      icon="tabler-x"
      size="20"
      @click="sidebar = !sidebar"
    />
  </VNavigationDrawer>

  <!-- 👉 Navbar for desktop devices  -->
  <div class="front-page-navbar">
    <VAppBar
      :color="$vuetify.theme.current.dark ? 'rgba(var(--v-theme-background))' : 'rgba(255,255,255, 0.38)'"
      :class="y > 10 ? 'app-bar-scrolled' : [$vuetify.theme.current.dark ? 'app-bar-dark' : 'app-bar-light', 'elevation-0']"
      class="navbar-blur"
    >
      <!-- toggle icon for mobile device -->
      <IconBtn
        id="vertical-nav-toggle-btn"
        class="ms-n3 me-2 d-inline-block d-md-none"
        @click="sidebar = !sidebar"
      >
        <VIcon
          size="26"
          icon="tabler-menu-2"
          color="rgba(var(--v-theme-on-surface))"
        />
      </IconBtn>
      <!-- Title and Landing page sections -->
      <div class="d-flex align-center">
        <VAppBarTitle class="me-6">
          <RouterLink
            to="/"
            class="d-flex gap-x-4"
            :class="$vuetify.display.mdAndUp ? 'd-none' : 'd-block'"
          >
            <div class="d-flex gap-x-3 align-center">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
              <h4 class="text-h4 text-capitalize text-truncate font-weight-bold">
                {{ themeConfig.app.title }}
              </h4>
            </div>
          </RouterLink>
        </VAppBarTitle>

        <!-- landing page sections -->
        <div class="text-base align-center d-none d-md-flex">
          <RouterLink
            v-for="(item, index) in ['Home', 'Features', 'Team', 'FAQ', 'Contact us']"
            :key="index"
            :to="{ name: 'front-pages-landing-page', hash: `#${item.toLowerCase().replace(' ', '-')}` }"
            class="nav-link font-weight-medium py-2 px-2 px-lg-4"
            :class="[props.activeId?.toLocaleLowerCase().replace('-', ' ') === item.toLocaleLowerCase() ? 'active-link' : '']"
          >
            {{ item }}
          </RouterLink>

          <!-- Pages Menu -->
          <span
            class="font-weight-medium cursor-pointer px-2 px-lg-4 py-2"
            :class="isPageActive || isMegaMenuOpen ? 'active-link' : ''"
            style="color: rgba(var(--v-theme-on-surface))"
          >
            Pages
            <VIcon
              icon="tabler-chevron-down"
              size="12"
            />
            <VMenu
              v-model="isMegaMenuOpen"
              open-on-hover
              activator="parent"
              transition="slide-y-transition"
              location="bottom center"
              offset="16"
              content-class="mega-menu"
              location-strategy="static"
              close-on-content-click
            >
              <VCard max-width="1000">
                <VCardText class="pa-8">
                  <div class="nav-menu">
                    <div
                      v-for="(item, index) in menuItems"
                      :key="index"
                    >
                      <div class="d-flex align-center gap-x-3 mb-6">
                        <VAvatar
                          variant="tonal"
                          color="primary"
                          rounded
                          :icon="item.listIcon"
                        />
                        <div class="text-body-1 text-high-emphasis font-weight-medium">
                          {{ item.listTitle }}
                        </div>
                      </div>
                      <ul>
                        <li
                          v-for="listItem in item.navItems"
                          :key="listItem.name"
                          style="list-style: none;"
                          class="text-body-1 mb-4 text-no-wrap"
                        >
                          <RouterLink
                            class="mega-menu-item"
                            :to="listItem.to"
                            :target="item.listTitle === 'Page' ? '_self' : '_blank'"
                            :class="isCurrentRoute(listItem.to) ? 'active-link' : 'text-high-emphasis'"
                          >
                            <div class="d-flex align-center">
                              <VIcon
                                icon="tabler-circle"
                                color="primary"
                                :size="10"
                                class="me-2"
                              />
                              <span>{{ listItem.name }}</span>
                            </div>
                          </RouterLink>
                        </li>
                      </ul>
                    </div>
                    <img
                      :src="navImg"
                      alt="Navigation Image"
                      class="d-inline-block rounded-lg"
                      style="border: 10px solid rgb(var(--v-theme-background));"
                      :width="$vuetify.display.lgAndUp ? '330' : '250'"
                      :height="$vuetify.display.lgAndUp ? '330' : '250'"
                    >
                  </div>
                </VCardText>
              </VCard>
            </VMenu>
          </span>

          <RouterLink
            to="/"
            target="_blank"
            class="nav-link font-weight-medium px-2 px-lg-4 py-2"
          >
            Admin
          </RouterLink>
        </div>
      </div>

      <VSpacer />

      <div class="d-flex gap-x-4">
        <NavbarThemeSwitcher />

        <VBtn
          variant="elevated"
          color="primary"
          href="https://themeforest.net/item/vuexy-vuejs-html-laravel-admin-dashboard-template/23328599?irgwc=1&clickid=T9302WQDcxyNR6%3AwXJ3nw0x2UkFyW3Xmfwd-V00&iradid=275988&irpid=1244113&iradtype=ONLINE_TRACKING_LINK&irmptype=mediapartner&mp_value1=&utm_campaign=af_impact_radius_1244113&utm_medium=affiliate&utm_source=impact_radius"
          target="_blank"
          rel="noopener noreferrer"
        >
          <VIcon
            icon="tabler-shopping-cart"
            size="18"
          />
          <span class="d-none d-lg-block ms-2">Purchase Now</span>
        </VBtn>
      </div>
    </VAppBar>
  </div>
</template>

<style lang="scss" scoped>
.nav-menu{
  display: flex;
  gap: 3rem;
}

.nav-link{
  &:not(:hover){
    color: rgb(var(--v-theme-on-surface))
  }
}

.page-link{
  &:hover{
    color: rgb(var(--v-theme-primary)) !important;
  }
}

@media (max-width: 1280px){
  .nav-menu{
    gap: 2.25rem;
  }
}

@media (min-width: 1920px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1440px - 32px);
    }
  }
}

@media (min-width: 1280px) and (max-width: 1919px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(1200px - 32px);
    }
  }
}

@media (min-width: 960px) and (max-width: 1279px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(900px - 32px);
    }
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 64px);
    }
  }
}

@media (max-width: 600px) {
  .front-page-navbar {
    .v-toolbar {
      max-inline-size: calc(100% - 32px);
    }
  }
}

.nav-item-img {
  border: 10px solid rgb(var(--v-theme-background));
  border-radius: 10px;
}

.active-link {
  color: rgb(var(--v-theme-primary)) !important;
}

.app-bar-light{
  border: 2px solid rgba(var(--v-theme-surface),68%);
  border-radius: 0.5rem;
  background-color: rgba(var(-v--theme-surface),38%);
  transition: all 0.1s ease-in-out;
}

.app-bar-dark{
  border: 2px solid rgba(255,255,255,8%);
  border-radius: 0.5rem;
  background-color: rgba(255,255,255,4%);
  transition: all 0.1s ease-in-out;
}

.app-bar-scrolled{
  border-radius: 0.5rem;
  background-color: rgb(var(--v-theme-surface)) !important;
  transition: all 0.1s ease-in-out;
}

.front-page-navbar::after{
  position: fixed;
  z-index: 2;
  backdrop-filter: saturate(100%) blur(6px);
  block-size: 5rem;
  content: '';
  inline-size: 100%
}
</style>

<style lang="scss">
@use "@layouts/styles/mixins" as layoutMixins;

.mega-menu{
  position: fixed !important;
  inset-block-start: 5rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);
}

.front-page-navbar {
  .v-toolbar__content {
    padding-inline: 1.5rem !important;
  }

  .v-toolbar {
    inset-inline: 0 !important;
    margin-block-start: 1rem !important;
    margin-inline: auto !important;
  }

}

.mega-menu-item {
  &:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}

#navigation-drawer-close-btn {
  position: absolute;
  cursor: pointer;
  inset-block-start: 0.5rem;
  inset-inline-end: 1rem;
}
</style>
