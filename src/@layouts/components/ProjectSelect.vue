<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useFavicon } from '@vueuse/core'
import type { ProjectInfo } from '../../@model/project'
import { IconsList } from '../../@model/enums/icons'
import { useChangeProject } from '../../composables/useChangeProject'
import ApiService from '../../services/api'

const store = useStore()

const { changeProject } = useChangeProject()

const selectProject = computed({
  get: () => store.getters.selectedProjectWithoutPriority,
  set: val => changeProject(val),
})

const selectedProduct = computed(() => store.getters.selectedProduct)
const projects = computed(() => store.getters.userInfo.projects.filter((item: ProjectInfo) => item?.productId === selectedProduct.value?.id))
const cantSelect = computed(() => projects.value.length < 2)

onMounted(() => {
  const faviconPath = store.getters.selectedProjectWithoutPriority?.iconPath || '/favicon.ico'

  useFavicon(faviconPath)
})
watch(selectProject, project => {
  ApiService.setHeaders({
    MarbellaProject: project.originProject.alias,
  })
}, {
  immediate: true,
})
</script>

<template>
  <div
    class="project-select"
    :class="{ 'cant-select': cantSelect }"
  >
    <VueSelect
      v-model="selectProject"
      :options="projects"
      label="publicName"
      class="select-field text-color-base"
      :clearable="false"
      :searchable="false"
      :no-drop="cantSelect"
    >
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
            class="project-logo project-logo-no-ico d-flex align-center justify-center text-color-base"
          >
            {{ publicName[0].toUpperCase() }}
          </div>
          <span class="text-expanded text-color-base">{{ publicName || title }}</span>
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
            class="project-logo project-logo-no-ico d-flex align-center justify-center text-color-base"
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
            class="text-expanded text-color-base"
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

  :deep(.vs__dropdown-menu) {
    min-width: auto;
  }

  &--collapsed {
    :deep(.vs__actions) {
      display: none;
    }
    .text-expanded {
      display: none;
    }
    :deep(.vs__dropdown-option) {
      padding-left: 0.875rem;
      padding-right: 0.875rem;
    }
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
