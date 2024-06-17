<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'
import type { OptionsItem } from '../../../../@model'
import { IconsList } from '../../../../@model/enums/icons'
import type { SelectBaseField } from '../../../../@model/templates/baseField'
import { i18n } from '../../../../plugins/i18n'
import { withPopper } from '../../../../helpers/selectPopper'

const props = withDefaults(
  defineProps<{
    modelValue: OptionsItem | string | number
    field: SelectBaseField
    errors?: boolean
    disabled?: boolean
    size: string // TODO: refactor sizes
    placeholder?: string
  }>(),
  {
    modelValue: '',
    size: '',
    placeholder: i18n.t('placeholder.choose._') as string,
  })

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isMultiple = false
const isLoading = ref(false)

const valueModel = computed<OptionsItem>({
  get: () =>
    typeof props.modelValue === 'string' || typeof props.modelValue === 'number'
      ? props.field.options?.find((option: OptionsItem) => option.id === props.modelValue)
      : props.modelValue,
  set: (item: object) => emits('update:modelValue', item),
})

const selectClasses = computed(() => {
  const size = props.size ? `select-size-${props.size}` : null

  const classes: object = {
    error: props.errors,
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
  <div>
    <VueSelect
      v-model="valueModel"
      :placeholder="placeholder"
      label="name"
      :loading="isLoading"
      :multiple="isMultiple"
      :options="options"
      class="select-field"
      :class="selectClasses"
      :disabled="disabled"
      :clearable="field.clearable"
      :append-to-body="field.withCalculatePosition"
      :calculate-position="withPopper(props.field.toggleDropdownCb)"
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
  </div>
</template>
