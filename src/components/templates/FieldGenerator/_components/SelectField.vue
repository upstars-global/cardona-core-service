<script lang="ts">
import { PropType, ref, computed, watch } from 'vue'
import { debounce } from 'lodash'
import vSelect from 'vue-select'
import i18n from '../../../../libs/i18n'
import { SelectBaseField } from '../../../../@model/baseField'
import { OptionsItem } from '../../../../@model'

export default {
  name: 'SelectField',
  components: {
    vSelect,
  },

  props: {
    value: {
      type: [Object, String, Number],
      default: null,
    },

    field: {
      type: Object as PropType<SelectBaseField>,
      required: true,
    },

    errors: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'md',
    },

    placeholder: {
      type: String,
      default: () => i18n.t('placeholder.choose._'),
    },
  },

  emits: ['input'],

  setup(props, { emit }) {
    const isLoading = ref(false)

    const valueModel = computed<OptionsItem>({
      get: () =>
        typeof props.value === 'string' || typeof props.value === 'number'
          ? props.field.options?.find((option: OptionsItem) => option.id == props.value)
          : props.value,
      set: (item: object) => emit('input', item),
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

    return {
      isLoading,
      selectClasses,
      valueModel,
      options,
      onSearch,
    }
  },
}
</script>

<template>
  <v-select
    v-model="valueModel"
    :placeholder="placeholder"
    :dir="$store.getters['appConfig/dirOption']"
    label="name"
    :loading="isLoading"
    :options="options"
    class="select-field"
    :class="selectClasses"
    :disabled="disabled"
    :clearable="field.clearable"
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
      margin-top: 0;
    }

    .vs__actions {
      padding-top: 2px;
    }
  }
}
</style>
