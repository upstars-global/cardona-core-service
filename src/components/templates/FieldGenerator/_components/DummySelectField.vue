<script setup lang="ts">
import { computed } from 'vue'
import i18n from '../../../../libs/i18n'
import { OptionsItem } from '../../../../@model'
import { BSize } from '../../../../@model/bootstrap'

type DummySelectProps = {
  value?: OptionsItem | null
  options: OptionsItem[]
  errors?: string[]
  disabled?: boolean
  size?: BSize
  placeholder?: string
}

const props = withDefaults(defineProps<DummySelectProps>(), {
  value: null,
  errors: () => [],
  size: BSize.Md,
  placeholder: i18n.t('placeholder.choose._') as string,
})

const emits = defineEmits<{
  (event: 'input', item: OptionsItem | null): void
  (event: 'search', search: string): void
}>()

const selectClasses = computed(() => {
  const size = `select-${props.size}`
  const classes = {
    error: props.errors?.isNotEmpty,
  }

  return [size, classes]
})

const valueModel = computed<OptionsItem | null>({
  get: () => props.value,
  set: (item) => emits('input', item),
})

const onSearch = (search: string) => emits('search', search)
</script>

<template>
  <v-select
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
  </v-select>
</template>


<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.select-field {
  &.error {
    :deep(.vs__dropdown-toggle) {
      border-color: $red !important;
    }
  }

  .vs__selected {
    margin-top: 0.25rem;
  }

  .vs__actions {
    padding-top: 0.15rem;
  }
}

.select-sm {
  :deep(.vs__dropdown-toggle) {
    height: 30px;

    .search-select-icon {
      padding-top: 0;
    }

    .vs__search {
      margin: 0;
    }

    .vs__open-indicator {
      margin-top: 0;
    }
  }
}
</style>
