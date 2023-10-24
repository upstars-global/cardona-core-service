<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'
import type { FieldInfo } from '../../../../@model/field'
import type { OptionsItem } from '../../../../@model'

const props = defineProps<{
  modelValue: object | string | number
  field: FieldInfo
  errors: string[]
  disabled: boolean
  size: string // TODO: refactor sizes
  placeholder: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isMultiple = false
const isLoading = ref(false)

const valueModel = computed<OptionsItem>({
  get: () =>
    typeof props.value === 'string' || typeof props.value === 'number'
      ? props.field.options?.find((option: OptionsItem) => option.id === props.value)
      : props.value,
  set: (item: object) => emits('update:modelValue', item),
})

const selectClasses = computed(() => {
  const size = `select-${props.size}`

  const classes: object = {
    error: props.errors?.isNotEmpty,
  }

  return [size, classes]
})

// Options
const options = computed(() =>
  props.field.options
    ? props.field.options.filter((option: OptionsItem) => option.id !== valueModel.value?.id)
    : [],
)

watch(
  () => props.field.options,
  async () => {
    if (!props.field.options) {
      isLoading.value = true

      await props.field.fetchOptions()

      isLoading.value = false
    }
  },
  { deep: true, immediate: true },
)

// Handlers
const onSearch = debounce(async (search: string, loading: Function) => {
  loading(true)

  try {
    await props.field.fetchOptions(search)
  }
  finally {
    loading(false)
  }
}, 250)
</script>

<template>
  <VueSelect
    v-model="valueModel"
    :placeholder="placeholder"
    :dir="$store.getters['appConfig/dirOption']"
    label="name"
    :loading="isLoading"
    :multiple="isMultiple"
    :options="options"
    class="select-field"
    :class="selectClasses"
    :disabled="disabled"
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
