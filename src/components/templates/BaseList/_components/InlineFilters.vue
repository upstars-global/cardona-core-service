<script setup lang="ts">
import type { BaseField } from '../../../../@model/templates/baseField'
import FieldGenerator from '../../../../components/templates/FieldGenerator/index.vue'
import { VSizes } from '../../../../@model/vuetify'

defineOptions({
  name: 'InlineFilters',
})

withDefaults(defineProps<Props>(), {
  size: VSizes.Medium,
})

const emits = defineEmits<{
  change: [fields: BaseField[]]
}>()

interface Props {
  filterFields: BaseField[]
  size?: VSizes
}
</script>

<template>
  <div>
    <div class="d-flex items-center flex-start">
      <div
        v-for="(field, index) in filterFields"
        :key="field.key"
        :data-inline-filter="field.key"
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

<style lang="scss" scoped>
div[data-inline-filter="singleProject"] {
  width: 265px !important;
}
</style>
