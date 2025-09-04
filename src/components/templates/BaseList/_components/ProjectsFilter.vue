<script setup lang="ts">
import { VColors } from '../../../../@model/vuetify'
import { IconsList } from '../../../../@model/enums/icons'
import type { ProjectsFilterOption } from '../../../../@model/templates/baseList'

const props = defineProps<{
  modelValue: string[]
  projects: ProjectsFilterOption[]
}>()

const emits = defineEmits<{
  'update:modelValue': [selectedProjectsAliases: string[]]
}>()

const isActiveProject = ({ alias }: ProjectsFilterOption): boolean => props.modelValue.includes(alias)

const onClickBadge = ({ alias }: ProjectsFilterOption) => {
  if (!props.modelValue.includes(alias))
    emits('update:modelValue', [...props.modelValue, alias])

  else if (props.modelValue.includes(alias) && props.modelValue.length > 1)
    emits('update:modelValue', props.modelValue.filter(item => item !== alias))
}
</script>

<template>
  <div class="d-flex align-center">
    <p class="font-weight-semi-bold mr-2 mb-0">
      {{ $t('common.project._') }}
    </p>

    <VChip
      v-for="project in projects"
      :key="project.id"
      class="mr-2 cursor-pointer"
      :color="isActiveProject(project) ? VColors.Primary : VColors.Secondary"
      label
      @click="onClickBadge(project)"
    >
      <VIcon
        class="mr-1"
        :icon="isActiveProject(project) ? IconsList.EyeIcon : IconsList.EyeOffIcon"
        size="14"
      />

      <span>
        {{ project.title }}
      </span>
    </VChip>
  </div>
</template>
