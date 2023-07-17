<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import vSelect from 'vue-select'
import i18n from '../../../../libs/i18n'

export default defineComponent({
  name: 'DummySelectField',
  components: {
    vSelect,
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },

    options: {
      type: Array,
      default: () => [],
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

  emits: ['input', 'search'],

  setup(props, { emit }) {
    const selectClasses = computed(() => {
      const size: string = `select-${props.size}`
      const classes: object = {
        error: props.errors?.isNotEmpty,
      }

      return [size, classes]
    })

    const valueModel = computed({
      get: () => props.value,
      set: (item: object) => emit('input', item),
    })

    const onSearch = (search: string) => emit('search', search)

    return {
      selectClasses,
      valueModel,
      onSearch,
    }
  },
})
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
      background-color: red !important;
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
    background-color: red !important;
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
