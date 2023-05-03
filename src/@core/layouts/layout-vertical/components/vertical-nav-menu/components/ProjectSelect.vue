<template>
  <div class="project-select">
    <v-select
      v-model="selectProject"
      :dir="$store.getters['appConfigCore/dirOption']"
      :options="projects"
      label="publicName"
      :clearable="false"
      :searchable="false"
    >
      <template #selected-option="{ publicName, title, alias, iconPath }">
        <div class="row align-items-center flex-nowrap overflow-hidden px-1">
          <b-img v-if="iconPath" :alt="alias" :src="iconPath" class="project-logo mr-1" />
          <div
            v-else
            class="project-logo project-logo-no-ico d-flex align-items-center justify-content-center mr-1"
          >
            {{ publicName[0].toUpperCase() }}
          </div>
          <span class="text-expanded">{{ publicName || title }}</span>
        </div>
      </template>
      <template #option="{ publicName, title, alias, iconPath }">
        <div class="d-flex align-items-center flex-nowrap overflow-hidden px-50">
          <b-img v-if="iconPath" :alt="alias" :src="iconPath" class="project-logo mr-50" />
          <div
            v-else
            class="project-logo project-logo-no-ico d-flex align-items-center justify-content-center mr-50"
          >
            {{ publicName[0].toUpperCase() }}
          </div>
          <span class="text-expanded">{{ publicName || title }}</span>
        </div>
      </template>
      <template #open-indicator="{ attributes }">
        <span
          v-bind="attributes"
          class="row justify-content-center align-items-center text-expanded"
        >
          <feather-icon icon="CodeIcon" size="13" class="rotate-90" />
        </span>
      </template>
    </v-select>
  </div>
</template>

<script>
import { computed } from 'vue'
import store from '../../../../../../store'

export default {
  name: 'ProjectSelect',
  props: {},
  setup() {
    const selectProject = computed({
      get: () => store.getters.selectedProject,
      set: (val) => {
        store.dispatch('setSelectedProject', val)
      },
    })
    const projects = computed(() => store.getters.userInfo.projects)
    return {
      selectProject,
      projects,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../../../@core/scss/base/bootstrap-extended/include'; // Bootstrap includes
@import '../../../../../../@core/scss/base/components/include'; // Components includes

// Color palettes
@import '../../../../../../@core/scss/base/core/colors/palette-variables';
.dark-layout {
  .main-menu {
    .project-select {
      .vs__dropdown-toggle {
        background: $theme-dark-card-bg;
      }
    }
  }
}
.main-menu {
  &.expanded {
    .project-select {
      .vs__search {
        display: inline-block;
      }
      .text-expanded {
        display: inline;
      }
      .vs__dropdown-menu {
        max-width: 100%;
        min-width: 160px;
        .vs__dropdown-option {
          padding: 7px 10px;
          &::after {
            opacity: 1;
          }
        }
      }
      .vs__selected {
        line-height: 0;
      }
    }
  }

  .project-select {
    padding: 0 15px;

    .vs--open {
      .vs__open-indicator {
        transform: rotate(0) scale(1);
      }
    }

    .vs__open-indicator {
      padding-bottom: 3px;
    }

    .vs__dropdown-toggle {
      background: $white;
      min-height: 2.63rem;
      max-height: 2.63rem;
    }
    .vs__dropdown-menu {
      max-width: 100%;
      min-width: 50px;

      .vs__dropdown-option {
        padding-left: 7px;
        padding-right: 0;
        &::after {
          opacity: 0;
        }
      }
    }

    .vs--single.vs--open .vs__selected {
      transform: translateX(0px);
    }

    .vs__search {
      height: 0;
      width: 0;
      margin: 0;
    }
    .text-expanded {
      display: none;
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
      background: $primary;
      color: $white;
    }
  }
}
</style>
