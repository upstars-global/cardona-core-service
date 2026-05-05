<script setup lang="ts">
import { ref } from 'vue'
import { useAppConfigCoreStore } from '../../../../stores/appConfigCore'
import { useUserStore } from '../../../../stores/user'
import { SelectBaseField } from '../../../../@model/templates/baseField'
import type { OptionsItem } from '../../../../@model'

const appConfigCoreStore = useAppConfigCoreStore()
const userStore = useUserStore()

const projectFilter = ref(new SelectBaseField<OptionsItem>({
  key: 'projectFilter',
  value: userStore.getSelectedProject,
  options: appConfigCoreStore.verifiedProjects,
  label: '',
  clearable: false,
}))
</script>

<template>
  <div>
    <SelectField
      v-model="projectFilter.value"
      :field="projectFilter"
    />
  </div>
</template>
