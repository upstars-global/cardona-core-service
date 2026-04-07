<script setup lang="ts">
import type { BaseField } from '../../../../@model/templates/baseField'
import FieldGenerator from '../../../../components/templates/FieldGenerator/index.vue'
import { VSizes } from '../../../../@model/vuetify'

defineOptions({
  name: 'QuickFilters',
})

interface Props {
  filterFields: BaseField[]
  size?: VSizes
}

withDefaults(defineProps<Props>(), {
  size: VSizes.Medium,
})

const emits = defineEmits<{
  change: [fields: BaseField[]]
}>()
</script>

<template>
  <div>
    <div class="d-flex items-center flex-start">
      <div
        v-for="(field, index) in filterFields"
        :key="field.key"
        :data-quick-filter="field.key"
        :class="{ 'ml-4': index }"
      >
        <FieldGenerator
          v-model="filterFields[index]"
          :with-label="false"
          :size="size"
          @update:model-value="emits('change', filterFields)"
        />
      </div>
    </div>
  </div>
</template>
