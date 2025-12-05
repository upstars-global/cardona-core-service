<script setup lang="ts">
import { VIcon } from 'vuetify/components/VIcon'

import { computed } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { IconsList } from '../../@model/enums/icons'
import { VColors } from '../../@model/vuetify'
import { PermissionLevel } from '../../@model/permission'
import { useUserStore } from '../../stores/user'
import { useAppConfigCoreStore } from '../../stores/appConfigCore'
import { useAuthCoreStore } from '../../stores/authCore'
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
  <div
    class="custom-menu"
    :class="{ 'custom-menu--collapsed': isCollapsedMenu }"
  >
    <VMenu>
      <template #activator="{ props }">
        <div
          class="d-flex align-center cursor-pointer user-info"
          v-bind="props"
        >
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
              size="large"
              class="avatar-block"
            >
              <VImg
                v-if="userAvatar"
                :src="userAvatar"
                cover
                class="object-contain"
              />
              <h5
                v-else
                class="text-h5 text-body-1 first-letter text-success"
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
  background-color: rgba(var(--v-theme-success), var(--v-badge-opacity)) !important;
}
.first-letter {
  font-weight: 600;
}

.user-info {
  overflow: hidden;
  &:hover {
    .full-name {
      color: rgb(var(--v-theme-primary))
    }
  }
}
.full-name {
  font-weight: 500;
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-top: 1px solid rgb(var(--v-theme-grey-200));

  :deep(.v-badge__badge) {
    height: 11px;
    width: 11px;
    border-radius: 100%;
  }
}
</style>
