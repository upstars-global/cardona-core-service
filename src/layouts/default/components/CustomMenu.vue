<script setup lang="ts">
import { VIcon } from 'vuetify/components/VIcon'

import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { IconsList } from '../../../@model/enums/icons'
import { VColors } from '../../../@model/vuetify'
import { PermissionLevel } from '../../../@model/permission'
import { useUserStore } from '../../../stores/user'
import { useAppConfigCoreStore } from '../../../stores/appConfigCore'
import { useAuthCoreStore } from '../../../stores/authCore'
import { useConfigStore } from '@core/stores/config'
import { Theme } from '@core/enums'

const props = defineProps<{
  isCollapsedMenu: boolean
}>()

const { t } = useI18n()

const userStore = useUserStore()
const appConfigStore = useAppConfigCoreStore()
const authCoreStore = useAuthCoreStore()
const router = useRouter()

const userName = computed(() => {
  return userStore.userInfo?.userName || 'No name'
})

const userAvatar = computed(() => userStore.userInfo?.picture || '')

const firstLetter = computed(() => {
  return userName.value[0].toUpperCase()
})

const logOutAction = {
  title: t('customMenu.logout'),
  icon: IconsList.LogOutIcon,
  action: async () => {
    authCoreStore.clearAuth()
    await router.push('/login')
  },
}

const configStore = useConfigStore()

const canAllAdminSection = computed(() => {
  return userStore.abilityCan('backoffice-users-control', PermissionLevel.view)
})

const changeMode = computed(() => {
  const actualMode = configStore.theme === Theme.Light ? Theme.Dark : Theme.Light

  return {
    title: t(`customMenu.${actualMode}Mode`),
    icon: configStore.theme === Theme.Light ? IconsList.MoonIcon : IconsList.CloudLightningIcon,
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
      appConfigStore.onToggleMenuType()
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
        <div
          class="d-flex align-center cursor-pointer user-info mr-auto"
          v-bind="props"
        >
          <VBadge
            dot
            color="success"
            location="bottom end"
            bordered
            offset-x="2"
            offset-y="5"
            class="badge cursor-pointer"
          >
            <VAvatar
              :color="VColors.Success"
              size="32"
              class="avatar-block"
            >
              <VImg
                v-if="userAvatar"
                :src="userAvatar"
                cover
                class="object-contain"
                referrerpolicy="no-referrer"
              />
              <h5
                v-else
                class="text-h5 text-body-1 first-letter"
              >
                {{ firstLetter }}
              </h5>
            </VAvatar>
          </VBadge>
          <div class="full-name ml-5">
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
.avatar-block {
  height: 40px;
  width: 40px;
  background-color: rgba(var(--v-theme-blue-800)) !important;
}
.first-letter {
  font-weight: 600;
  font-size: 13px;
  color: #ffffff;
}

.user-info {
  margin-left: 10px;
  overflow: hidden;
}
.full-name {
  font-weight: 500;
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  transition: opacity 0.3s ease, max-width 0.3s ease, margin-left 0.3s ease;
}

.action-menu {
  :deep(.v-list-item) {
    padding-inline: 1rem !important;
    padding-block: 0.5rem !important;
    margin-inline: 0 !important;
    margin-block: 0 !important;
    min-inline-size: 86px !important;
    align-self: stretch !important;
    border-radius: 0 !important;
    gap: 8px !important;

    .v-list-item__spacer {
      width: 0 !important;
    }
  }

  :deep(.v-list-item__overlay) {
    background-color: rgb(var(--v-theme-on-sidebar)) !important;
  }

  :deep(.v-list-item:hover .v-list-item__overlay) {
    opacity: 0.06 !important;
  }
}

.divider {
  margin-block: 0.5rem;
}

.custom-menu {
  padding: 1rem 0.5rem;

  :deep(.v-badge__badge) {
    height: 11px;
    width: 11px;
    border-radius: 100%;
  }
  :deep(.v-badge__badge::after) {
    color: rgba(var(--v-theme-sidebar));
    border-width: 1px;
  }
}
</style>
