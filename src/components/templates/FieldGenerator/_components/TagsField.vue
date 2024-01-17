<script setup lang="ts">
import { computed } from 'vue'
import type { TagsBaseField } from '../../../../@model/templates/baseField'
import AppCombobox from '../../../../@core/components/app-form-elements/AppCombobox.vue'

const props = defineProps<{
  modelValue: Array<string>
  field: TagsBaseField
  errors: boolean
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: Array<string>): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const onDelete = (index: number) => {
  localModelValue.value = localModelValue.value.toSpliced(index, 1)
}
</script>

<template>
  <AppCombobox
    v-model="localModelValue"
    multiple
  >
    <template #selection="{ item, index }">
      <VChip
        closable
        @click:close="onDelete(index)"
      >
        {{ item.title }}
      </VChip>
    </template>
  </AppCombobox>
</template>
