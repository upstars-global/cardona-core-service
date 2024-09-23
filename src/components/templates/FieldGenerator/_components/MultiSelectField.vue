<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useI18n } from 'vue-i18n'
import type { OptionsItem } from '../../../../@model'
import { BSize } from '../../../../@model/bootstrap'
import type { MultiSelectBaseField } from '../../../../@model/templates/baseField'
import { withPopper } from '../../../../helpers/selectPopper'
import { IconsList } from '../../../../@model/enums/icons'

interface MultiselectProps {
  modelValue: OptionsItem[] | string[] | number[]
  field: MultiSelectBaseField
  errors?: boolean
  disabled?: boolean
  size?: BSize
}

const props = withDefaults(defineProps<MultiselectProps>(), {
  modelValue: () => [],
  size: BSize.Md,
})

const emits = defineEmits<{
  (event: 'update:modelValue', item: OptionsItem[]): void
}>()

const { t } = useI18n()
const isLoading = ref(false)
const placeholder = computed(() => t('placeholder.choose._'))

const valueModel = computed<OptionsItem[]>({
  get: () =>
    props.modelValue.map(item =>
      typeof item === 'string' || typeof item === 'number'
        ? props.field.options?.find((option: OptionsItem) => option.id == item)
        : item,
    ),
  set: (item: OptionsItem[]) => emits('update:modelValue', item),
})

const selectClasses = computed(() => {
  const size = props.size ? `select-size-${props.size}` : null

  const classes = {
    error: props.errors,
  }

  return [size, classes]
})

// Options
const options = computed(() =>
  props.field.options
    ? props.field.options.filter((option: OptionsItem) =>
      valueModel.value.every(item => item?.id !== option.id),
    )
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
      multiple
      :options="options"
      :class="selectClasses"
      :disabled="disabled"
      append-to-body
      :calculate-position="withPopper(field.calculatePositionCb)"
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
