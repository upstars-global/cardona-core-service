<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: object
  options: Array<any>
  errors: Array<string>
  size: string // TODO: refactor sizes
  placeholder: string
  disabled: boolean
}>()

const emits = defineEmits<{
  (e: 'search', search: string): void
  (e: 'update:modelValue', value: object): void
}>()

/* emits: ['input', 'search'], */

const selectClasses = computed(() => {
  const size = `select-${props.size}`

  const classes: object = {
    error: props.errors?.isNotEmpty,
  }

  return [size, classes]
})

const valueModel = computed({
  get: () => props.value,
  set: (item: object) => emit('input', item),
})

const onSearch = (search: string) => emits('search', search)
</script>

<template>
  <VueSelect
    v-model="valueModel"
    :placeholder="placeholder"
    :dir="$store.getters['appConfigCore/dirOption']"
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
  </VueSelect>
</template>
