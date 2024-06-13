<script setup lang="ts">
import { computed } from 'vue'
import { IconsList } from '../../../../@model/enums/icons'

const props = defineProps<{
  modelValue: object
  options: Array<any>
  errors: boolean
  size: string // TODO: refactor sizes
  placeholder: string
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'search', search: string): void
  (e: 'update:modelValue', value: object): void
}>()

const selectClasses = computed(() => {
  const size = props.size ? 'select-size-sm' : null

  const classes: object = {
    error: props.errors,
  }

  return [size, classes]
})

const valueModel = computed({
  get: () => props.modelValue,
  set: (item: object) => emits('update:modelValue', item),
})

const onSearch = (search: string) => emits('search', search)
</script>

<template>
  <VueSelect
    v-model="valueModel"
    :placeholder="placeholder"
    label="name"
    :disabled="disabled"
    :options="options"
    class="select-field"
    :class="selectClasses"
    @search="onSearch"
  >
    <template #no-options="{ loading, search }">
      <div v-if="!search && !loading">
        {{ $t('common.enterSomething') }}
      </div>

      <div v-else>
        {{ $t('common.nothingFound') }}
      </div>
    </template>

    <template #open-indicator="{ attributes }">
      <VIcon
        v-bind="attributes"
        :icon="IconsList.ChevronDownIcon"
      />
    </template>
  </VueSelect>
</template>
