<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { OptionsItem } from '../../../../@model'
import { BSize } from '../../../../@model/bootstrap'
import { debounce } from 'lodash'
import {MultiSelectBaseField} from "@/@model/templates/baseField";
import {i18n} from "@/plugins/i18n";

type MultiselectProps = {
  modelValue: OptionsItem[] | string[] | number[]
  field: MultiSelectBaseField
  errors?: boolean
  disabled?: boolean
  size?: BSize
  placeholder?: string
}

const props = withDefaults(defineProps<MultiselectProps>(), {
  modelValue: () => [],
  size: BSize.Md,
  placeholder: i18n.t('placeholder.choose._') as string,
})

const emits = defineEmits<{
  (event: 'update:modelValue', item: OptionsItem[]): void
}>()

const isLoading = ref(false)

const valueModel = computed<OptionsItem[]>({
  get: () =>
    props.modelValue.map((item) =>
      typeof item === 'string' || typeof item === 'number'
        ? props.field.options?.find((option: OptionsItem) => option.id == item)
        : item
    ),
  set: (item: OptionsItem[]) => emits('update:modelValue', item),
})

const selectClasses = computed(() => {
  const size = `select-${props.size}`
  const classes = {
    error: props.errors.isNotEmpty,
  }

  return [size, classes]
})

// Options
const options = computed(() =>
  props.field.options
    ? props.field.options.filter((option: OptionsItem) =>
        valueModel.value.every((item) => item.id !== option.id)
      )
    : []
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
  { deep: true, immediate: true }
)

// Handlers
const onSearch = debounce(async (search: string, loading: Function) => {
  loading(true)

  try {
    await props.field.fetchOptions(search)
  } finally {
    loading(false)
  }
}, 250)
</script>

<template>
  <div>
    <VueSelect
        v-model="valueModel"
        :placeholder="placeholder"
        :dir="$store.getters['appConfig/dirOption']"
        label="name"
        :loading="isLoading"
        multiple
        :options="options"
        class="multiselect-field"
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
  </div>
</template>

