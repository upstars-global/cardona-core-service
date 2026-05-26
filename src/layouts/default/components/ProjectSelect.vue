<script setup lang="ts">
import { computed, watch } from 'vue'
import { useFavicon } from '@vueuse/core'
import type { ProjectInfo } from '../../../@model/project'
import { IconsList } from '../../../@model/enums/icons'
import { useChangeProject } from '../../../composables/useChangeProject'
import { useUserStore } from '../../../stores/user'
import ApiService from '../../../services/api'

const props = defineProps<{
  projects: ProjectInfo[]
  isCollapsedMenu?: boolean
}>()

const userStore = useUserStore()
const { changeProject } = useChangeProject()

const selectProject = computed({
  get: () => userStore.selectedProjectWithoutPriority,
  set: val => changeProject(val),
})

const cantSelect = computed(() => props.projects.length < 2)
const isMarbella = computed(() => userStore.isMarbella)

watch(() => selectProject.value, () => {
  const faviconPath = userStore.selectedProjectWithoutPriority?.iconPath || '/favicon.ico'

  useFavicon(faviconPath)
}, { deep: true, immediate: true })

watch(() => selectProject.value, project => {
  if (!project || !isMarbella.value)
    return
  ApiService.setHeaders({
    MarbellaProject: selectProject.value.alias,
  })
}, {
  immediate: true,
})
</script>

<template>
  <div
    class="project-select"
    :class="{ 'cant-select': cantSelect, 'project-select--collapsed': isCollapsedMenu }"
  >
    <VueSelect
      v-model="selectProject"
      :options="projects"
      label="publicName"
      class="select-field select-field-color"
      :clearable="false"
      :searchable="false"
      :no-drop="isCollapsedMenu && !cantSelect"
    >
      <template #list-header>
        <div class="projects-dropdown-header">
          {{ $t('common.project.list') }}
        </div>
      </template>
      <template #selected-option="{ publicName, title, alias, iconPath }">
        <div class="d-flex align-center overflow-hidden gap-2">
          <img
            v-if="iconPath"
            :alt="alias"
            :src="iconPath"
            class="project-logo"
          >
          <div
            v-else
            class="project-logo project-logo-no-ico d-flex align-center justify-center select-field-color"
          >
            {{ publicName[0].toUpperCase() }}
          </div>
          <span class="text-expanded select-field-color">{{ publicName || title }}</span>
        </div>
      </template>
      <template #option="{ publicName, title, alias, iconPath }">
        <div class="d-flex  align-center overflow-hidden gap-2">
          <img
            v-if="iconPath"
            :alt="alias"
            :src="iconPath"
            class="project-logo"
          >
          <div
            v-else
            class="project-logo project-logo-no-ico d-flex align-center justify-center select-field-color"
          >
            {{ publicName[0].toUpperCase() }}
          </div>
          <span class="text-expanded">{{ publicName || title }}</span>
          <VIcon
            v-if="selectProject.publicName === publicName"
            :icon="IconsList.CheckIcon"
            class="ml-auto"
          />
        </div>
      </template>
      <template #open-indicator="{ attributes }">
        <div
          v-if="!cantSelect"
          v-bind="attributes"
        >
          <VIcon
            :icon="IconsList.ChevronDownIcon"
            class="text-expanded select-field-color"
          />
        </div>
      </template>
    </VueSelect>
  </div>
</template>

<style scoped lang="scss">
.project-select {
  :deep(.vs__selected-options) {
    flex-wrap: nowrap;

    .vs__search {
      flex: 0 0 0;
      padding: 0;

      &:focus {
        padding: 0;
      }
    }
  }

  // ── Dropdown menu ────────────────────────────────────────────────────────
  :deep(.vs__dropdown-menu) {
    margin-top: -12px !important;
    background: rgb(var(--v-theme-sidebar)) !important;
    border: 1px solid rgba(var(--v-theme-on-sidebar), 0.16) !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 16px rgb(var(--v-theme-shadow)) !important;
    padding: 8px 0 !important;
    width: 100% !important;
    min-width: unset !important;
  }

  :deep(.vs__dropdown-option) {
    padding: 8px 16px !important;
    font-size: 15px !important;
    line-height: 22px !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
    background: transparent !important;
  }

  :deep(.vs__dropdown-option--selected::after) {
    display: none !important;
  }

  :deep(.vs__dropdown-option:hover),
  :deep(.vs__dropdown-option--highlight) {
    background: rgba(var(--v-theme-on-sidebar), 0.06) !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
  }

  :deep(.vs__dropdown-option--selected),
  :deep(.vs__dropdown-option--selected.vs__dropdown-option--highlight),
  :deep(.vs__dropdown-option--selected:hover) {
    background: transparent !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
  }

  &--collapsed {
    :deep(.vs__dropdown-toggle) {
      padding-inline: 0 !important;
    }

    :deep(.vs__actions) {
      display: none;
    }

    :deep(.vs__dropdown-option) {
      padding-left: 0.875rem;
      padding-right: 0.875rem;
    }
  }

  .select-field-color {
    color: rgba(var(--v-theme-grey-900), var(--v-body-opacity));
  }

  .projects-dropdown-header {
    padding: 0 8px 8px;
    font-size: 12px !important;
    line-height: 15px;
    letter-spacing: 0.4px;
    color: rgba(var(--v-theme-on-sidebar), 0.56) !important;
  }
}

.project-logo {
  width: 1.5rem;
  height: 1.5rem;
  min-width: 1.5rem;
  min-height: 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 2px;
  margin-bottom: 2px;
}

.project-logo-no-ico {
  background: rgb(var(--v-theme-primary));
  color: white;
}
</style>
