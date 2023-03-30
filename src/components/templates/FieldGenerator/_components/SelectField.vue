<script lang="ts">
import { PropType, computed, watch } from 'vue'
import { debounce } from 'lodash'
import vSelect from 'vue-select'
import i18n from '../../../../libs/i18n'
import { FieldInfo } from '../../../../@model/field'
import { OptionsItem } from '../../../../@model'

export default {
  name: 'SelectField',
  components: {
    vSelect,
  },

  props: {
    value: {
      type: Object as PropType<OptionsItem>,
      default: null,
    },

    field: {
      type: Object as PropType<FieldInfo>,
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
    const isMultiple = false

    const valueModel = computed({
      get: () => props.value,
      set: (item: object) => emit('input', item),
    })

    const selectClasses = computed(() => {
      const size: string = `select-${props.size}`
      const classes: object = {
        error: props.errors?.isNotEmpty,
      }

      return [size, classes]
    })

    // Options
    const options = computed(() =>
      props.field.options
        ? props.field.options.filter((option: any) => option.id !== props.value?.id)
        : []
    )

    watch(
      () => props.field.options,
      async () => {
        if (!props.field.options) await props.field.fetchOptions()
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
      isMultiple,
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
    :dir="$store.getters['appConfigCore/dirOption']"
    label="name"
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
  </v-select>
</template>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';
@import '../../../../assets/scss/style.scss';

.select-field::v-deep {
  &:not(.vs--single) {
    .vs__dropdown-toggle {
      padding-left: 6px;
    }

    .vs__selected,
    .vs__dropdown-option--selected {
      background-color: $bg-light-purple;
      color: $purple;
      font-weight: 500;
    }
  }

  &.error {
    .vs__dropdown-toggle {
      border-color: $red;
    }
  }
}

.select-sm::v-deep {
  .vs__dropdown-toggle {
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

  &.vs--single {
    .vs__selected {
      margin-top: 0;
    }
  }
}
</style>
