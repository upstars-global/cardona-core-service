<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { IconsList } from '../../@model/enums/icons'
import { useChangeProject } from '../../composables/useChangeProject'

const store = useStore()

const { changeProject } = useChangeProject()

const selectProject = computed({
  get: () => store.getters.selectedProject,
  set: val => {
    changeProject(val)
  },
})

const projects = computed(() => store.getters.userInfo.projects)
const cantSelect = computed(() => projects.value.length < 2)
</script>

<template>
  <div
    class="project-select over"
    :class="{ 'cant-select': cantSelect, 'overflow-hidden': !cantSelect }"
  >
    <VueSelect
      v-model="selectProject"
      :options="projects"
      label="publicName"
      class="select-field"
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
            class="project-logo project-logo-no-ico d-flex align-center justify-center"
          >
            {{ publicName[0].toUpperCase() }}
          </div>
          <span class="text-expanded">{{ publicName || title }}</span>
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
            class="project-logo project-logo-no-ico d-flex align-center justify-center"
          >
            {{ publicName[0].toUpperCase() }}
          </div>
          <span class="text-expanded">{{ publicName || title }}</span>
        </div>
      </template>
      <template #open-indicator="{ attributes }">
        <VIcon
          v-if="cantSelect"
          v-bind="attributes"
          :icon="IconsList.ChevronDownIcon"
          class="text-expanded"
        />
      </template>
    </VueSelect>
  </div>
</template>

<style scoped lang="scss">
.project-select {
  :deep(.vs__selected-options) {
    flex-wrap: nowrap;

    .vs__search {
      display: none;
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
