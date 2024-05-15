<script setup lang="ts">
import { VIcon } from 'vuetify/components/VIcon'
import { useStore } from 'vuex'
import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { IconsList } from '../../@model/enums/icons'
import { VColors } from '../../@model/vuetify'
import { PermissionLevel } from '../../@model/permission'
import { useConfigStore } from '@core/stores/config'
import { Theme } from '@core/enums'

const { t } = useI18n()

const store = useStore()
const router = useRouter()

const userName = computed(() => {
  return store.getters.userInfo?.userName || 'No name'
})

const firstLetter = computed(() => {
  return userName.value[0].toUpperCase()
})

const logOutAction = {
  title: t('customMenu.logout'),
  icon: IconsList.LogOutIcon,
  action: async () => {
    store.dispatch('authCore/clearAuth')
    await router.push({ name: 'Login' })
  },
}

const configStore = useConfigStore()

const canAllAdminSection = computed(() => {
  return store.getters.abilityCan('backoffice-users-control', PermissionLevel.view)
})

const changeMode = computed(() => {
  const actualMode = configStore.theme === Theme.Light ? Theme.Dark : Theme.Light

  return {
    title: t(`customMenu.${actualMode}Mode`),
    icon: IconsList.MoonIcon,
    action: () => {
      configStore.theme = actualMode
    },
  }
})

const superAdminMenu = computed(() => {
  return {
    title: t('customMenu.adminSection'),
    icon: IconsList.CommandIcon,
    action: async () => {
      await store.dispatch('appConfigCore/onToggleMenuType')
      router.push({ name: 'UsersControlList' })
    },
  }
})

const customMenuActions = computed((): Array<{ title: TranslateResult; icon: IconsList; action?: Function }> => {
  return canAllAdminSection.value ? [superAdminMenu.value, changeMode.value] : [changeMode.value]
})
</script>

<template>
  <div class="custom-menu">
    <VMenu>
      <template #activator="{ props }">
        <div class="d-flex align-center">
          <VBadge
            dot
            color="success"
            location="bottom end"
            bordered
            offset-x="5"
            offset-y="5"
            class="badge cursor-pointer"
          >
            <VAvatar
              :color="VColors.Success"
              variant="tonal"
              size="large"
              v-bind="props"
            >
              <span class="text-h5 first-letter">{{ firstLetter }}</span>
            </VAvatar>
          </VBadge>
          <div class="full-name">
            {{ userName }}
          </div>
        </div>
      </template>
      <VList class="action-menu">
        <VListItem
          v-for="(item, index) in customMenuActions"
          :key="index"
          :value="index"
          class="action-item"
          @click="item.action && item.action()"
        >
          <template #prepend>
            <VIcon :icon="item.icon" />
          </template>
          <VListItemTitle class="px-0">
            {{ item.title }}
          </VListItemTitle>
        </VListItem>
        <VDivider class="divider" />
        <VListItem
          class="action-item"
          value="-1"
          @click="logOutAction.action"
        >
          <template #prepend>
            <VIcon :icon="logOutAction.icon" />
          </template>
          <VListItemTitle class="px-0">
            {{ logOutAction.title }}
          </VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </div>
</template>

<style lang="scss" scoped>
.first-letter {
  font-weight: 600;
}

.full-name {
  font-weight: 600;
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
  margin-left: 1rem;
}

.action-menu {
  :deep(.v-list-item) {
    padding-inline: 0.5rem !important;
    margin-inline: 0rem !important;
    margin-block: 0rem !important;
    padding-block: 0rem !important;
    min-block-size: 2rem !important;
    border-radius: 0 !important;
    .v-list-item__spacer {
      width: 0.25rem;
    }
  }
}

.divider {
  margin-block: 0.5rem;
  background-color: rgba(var(--v-border-color), var(--v-border-opacity));
}

.custom-menu {
  padding: 1rem;
  :deep(.v-badge__badge) {
    height: 11px;
    width: 11px;
    border-radius: 100%;
  }
}
</style>
