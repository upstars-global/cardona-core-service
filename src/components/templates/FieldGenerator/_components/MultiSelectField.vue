<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import i18n from '../../../../libs/i18n'
import { MultiSelectBaseField } from '../../../../@model/baseField'
import { OptionsItem } from '../../../../@model'
import { BSize } from '../../../../@model/bootstrap'
import { debounce } from 'lodash'

type MultiselectProps = {
  value: OptionsItem[] | string[] | number[]
  field: MultiSelectBaseField
  errors?: string[]
  disabled?: boolean
  size?: BSize
  placeholder?: string
}

const props = withDefaults(defineProps<MultiselectProps>(), {
  value: () => [],
  errors: () => [],
  size: BSize.Md,
  placeholder: i18n.t('placeholder.choose._') as string,
})

const emits = defineEmits<{
  (event: 'input', item: OptionsItem[]): void
}>()

const isLoading = ref(false)

const valueModel = computed<OptionsItem[]>({
  get: () =>
    props.value.map((item) =>
      typeof item === 'string' || typeof item === 'number'
        ? props.field.options?.find((option: OptionsItem) => option.id == item)
        : item
    ),
  set: (item: OptionsItem[]) => emits('input', item),
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
  <v-select
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
  </v-select>
</template>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';
@import '../../../../assets/scss/style.scss';

.multiselect-field {
  :deep(.vs__dropdown-toggle) {
    padding-left: 6px;
  }

  :deep(.vs__selected, .vs__dropdown-option--selected) {
    background-color: $bg-light-purple;
    color: $purple;
    font-weight: $font-weight-bold;
  }

  &.vs--disabled {
    :deep(.vs__selected, .vs__dropdown-option--selected) {
      color: $text-muted;
      background-color: rgba($gray-700, 0.12);
    }
  }

  &.error {
    :deep(.vs__dropdown-toggle) {
      border-color: $red;
    }
  }
}

.select-sm {
  :deep(.vs__dropdown-toggle) {
    padding-top: 1px;
    padding-bottom: 1px;

    .search-select-icon {
      padding-top: 0;
    }

    .vs__search {
      margin: 0;
    }

    .vs__open-indicator {
      margin-top: 0;
    }

    .vs__selected {
      margin-top: 2px;
    }

    .vs__actions {
      padding-top: 2px;
    }
  }
}
</style>

