<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { layoutConfig } from '@layouts'
import { useLayoutConfigStore } from '@layouts/stores/config'
import type { NavLink } from '@layouts/types'
import { getComputedNavLinkToProp, getDynamicI18nProps, isNavLinkActive, safeResolveRoute } from '@layouts/utils'

const props = defineProps<{
  item: NavLink
}>()

const router = useRouter()

const navLinkProps = computed(() => {
  const { to, ...rest } = getComputedNavLinkToProp.value(props.item)
  const resolved = to ? safeResolveRoute(router, to) : undefined

  return { ...rest, to: resolved?.fullPath ?? '' }
})

const configStore = useLayoutConfigStore()
const hideTitleAndBadge = configStore.isVerticalNavMini()

const onClick = () => {
  if (props.item.to)
    configStore.toggleMenu(false)
}
</script>

<template>
  <li
    class="nav-link"
    :class="{ disabled: item.disable }"
  >
    <Component
      :is="item.to ? 'RouterLink' : 'a'"
      v-bind="navLinkProps"
      :class="{ 'router-link-active router-link-exact-active': isNavLinkActive(item, $router) }"
      @click="onClick"
    >
      <Component
        :is="layoutConfig.app.iconRenderer || 'div'"
        v-bind="item.icon"
        class="nav-item-icon"
      />
      <TransitionGroup name="transition-slide-x">
        <!-- 👉 Title -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-show="!hideTitleAndBadge"
          key="title"
          class="nav-item-title font-weight-regular"
          :class="{ 'nav-item-color': !isNavLinkActive(item, $router) }"
          v-bind="getDynamicI18nProps(item.title, 'span')"
        >
          {{ item.title }}
        </Component>

        <!-- 👉 Badge -->
        <Component
          :is="layoutConfig.app.i18n.enable ? 'i18n-t' : 'span'"
          v-if="item.badgeContent"
          v-show="!hideTitleAndBadge"
          key="badge"
          class="nav-item-badge"
          :class="item.badgeClass"
          v-bind="getDynamicI18nProps(item.badgeContent, 'span')"
        >
          {{ item.badgeContent }}
        </Component>
      </TransitionGroup>
    </Component>
  </li>
</template>

<style lang="scss">
.layout-vertical-nav {
  .nav-link a {
    display: flex;
    align-items: center;
  }
}

.nav-item-color {
  color: rgba(var(--v-theme-grey-900), var(--v-body-opacity));
}
</style>
