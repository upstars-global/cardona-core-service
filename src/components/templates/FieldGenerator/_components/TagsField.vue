<script setup lang="ts">
import { computed } from 'vue'
import type { FieldInfo } from '../../../../@model/field'
import { IconsList } from '../../../../@model/enums/icons'

const props = defineProps<{
  modelValue: Array<string>
  field: FieldInfo
  errors: Array<string>
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: Array<string>): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const currentValue = ref('')
const isDuplicateValue = computed(() => localModelValue.value.includes(localModelValue))

const onAddValue = () => {
  if (isDuplicateValue.value)
    return

  localModelValue.value.push(currentValue.value)
  currentValue.value = ''
}
</script>

<template>
  <AppCombobox
    v-model="currentValue"
    multiple
    @keydown.enter="onAddValue"
  >
    <template #selection="{ item }">
      <VChip>
        {{ item.title }}
        <VIcon :icon="IconsList.XIcon" />
      </VChip>
    </template>
  </AppCombobox>
</template>
