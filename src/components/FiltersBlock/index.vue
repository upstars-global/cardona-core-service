<template>
  <b-col class="p-0" :class="{ 'filters-block-small': isSmallBlock }">
    <b-card v-if="isOpen" no-body>
      <b-card-header>
        <component :is="headerTag" class="mb-0">
          {{ $t('common.filter.filtrate') }}
        </component>
      </b-card-header>

      <hr class="m-0" />

      <b-card-body>
        <b-col class="pl-0 pr-0">
          <b-row>
            <b-col cols="12" md="3" class="mb-md-0 mb-2">
              <filter-selector
                :filters="listNotSelected"
                :size="size"
                @selectedFiltersChanged="onChange"
              />
            </b-col>
          </b-row>

          <b-row v-for="(filter, key) in selectedFilters" :key="key" class="mt-2">
            <b-col md="3" class="d-flex align-items-center">
              <p class="font-weight-bolder mb-0" :class="{ 'font-small-3': isSmallBlock }">
                {{ filter.label }}
              </p>
            </b-col>

            <b-col md="9" class="d-flex align-items-center">
              <field-generator
                v-model="selectedFilters[key]"
                :with-label="false"
                :size="size"
                class="field-generator mr-1 w-100"
              />

              <b-button
                variant="outline-danger"
                class="btn-icon"
                :size="size"
                @click="onRemoveFilter(filter)"
              >
                <feather-icon icon="Trash2Icon" />
              </b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-card-body>

      <b-card-footer>
        <div class="d-flex justify-content-between">
          <div>
            <b-button variant="success" :size="size" @click="onApply">
              {{ isSmallBlock ? $t('action.apply') : $t('action.applyFilters') }}
            </b-button>

            <b-button
              variant="outline-secondary"
              :size="size"
              class="save-btn"
              @click="onSaveByDefault"
            >
              {{ $t('action.saveByDefault') }}
            </b-button>
          </div>

          <div>
            <b-button
              variant="outline-danger"
              class="white-space-nowrap"
              :size="size"
              @click="onClearAll"
            >
              {{ $t('action.clearAll') }}
            </b-button>
          </div>
        </div>
      </b-card-footer>
    </b-card>

    <div v-else-if="selectedFilters.length" class="d-flex flex-wrap align-items-center pb-1">
      <span class="font-small-3 font-weight-bold text-body-heading mr-1 mb-50">
        {{ $t('common.filter.appliedFilters') }}
      </span>
      <b-badge
        v-for="filter in selectedFilters"
        :key="filter.key"
        class="mr-1 mb-50"
        variant="light-secondary"
      >
        {{ filter.label }}

        <span
          v-if="Array.isArray(filter.value) && filter.value.length && filter.type !== 'sum-range'"
          class="ml-20"
        >
          ({{ filter.value.length }})
        </span>
      </b-badge>
    </div>
  </b-col>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, watch, onMounted } from 'vue'
import store from '../../store'
import { useRouter } from '../../@core/utils/utils'
import { setStorage } from '../../helpers/storage'
import useToastService from '../../helpers/toasts'
import { Filter } from '../../@model/filter'
import FilterSelector from './_components/FilterSelector.vue'
import FieldGenerator from '../../components/templates/FieldGenerator/index.vue'

export default defineComponent({
  name: 'FiltersBlock',
  components: {
    FieldGenerator,
    FilterSelector,
  },
  props: {
    entityName: {
      type: String,
      default: '',
    },
    filters: {
      type: Array as PropType<Filter[]>,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'md',
    },
  },

  emits: ['apply', 'changeSelectedFilters'],

  setup(props, { emit }) {
    const { route } = useRouter()
    const { toastSuccess } = useToastService()

    const { name: pageName } = route.value
    const keyStorage = `${pageName}-${props.entityName}-list-filters`

    const selectedFilters = ref<Filter[]>([])

    const isSmallBlock: boolean = props.size === 'sm'
    const headerTag: string = isSmallBlock ? 'h5' : 'h4'

    const onChange = (filter: Filter) => selectedFilters.value.push(filter)

    const onRemoveFilter = ({ key }: Filter) => {
      selectedFilters.value = selectedFilters.value.filter((filter) => filter.key !== key)

      onApply()
    }

    const onClearAll = () => {
      selectedFilters.value = []

      onApply()
    }

    const onApply = () => {
      store.commit('filtersCore/SET_LIST_ENTITY_NAME', props.entityName)
      store.commit('filtersCore/SET_LIST_PATH', route.value.path)
      store.commit('filtersCore/SET_LIST_FILTERS', selectedFilters.value)

      emit('apply')
    }

    watch(selectedFilters, (filters) => {
      emit('changeSelectedFilters', filters)
    })

    onMounted(() => {
      const initFiltersStorage = localStorage.getItem(keyStorage)
      const isSamePath = route.value.path === store.getters['filtersCore/listPath']
      const isSameEntity = props.entityName === store.getters['filtersCore/listEntityName']

      if (!isSamePath || !isSameEntity) {
        store.commit('filtersCore/SET_LIST_ENTITY_NAME')
        store.commit('filtersCore/SET_LIST_PATH')
        store.commit('filtersCore/SET_LIST_FILTERS')
      }

      if (store.getters['filtersCore/appliedListFilters'].length) {
        selectedFilters.value = store.getters['filtersCore/appliedListFilters']
      } else if (initFiltersStorage) {
        selectedFilters.value = props.filters.filter(({ key }: Filter) =>
          initFiltersStorage?.includes(key)
        )

        emit('changeSelectedFilters', selectedFilters.value)
      }
    })

    const selectedFiltersKeys = computed(() => {
      return selectedFilters.value.map(({ key }) => key)
    })

    const onSaveByDefault = () => {
      setStorage(keyStorage, selectedFiltersKeys.value)

      toastSuccess('filtersSavedByDefault')
    }

    const listNotSelected = computed(() => {
      return props.filters.filter(({ key }) => !selectedFiltersKeys.value.includes(key))
    })

    return {
      selectedFilters,
      listNotSelected,
      isSmallBlock,
      headerTag,

      // Handlers
      onChange,
      onRemoveFilter,
      onSaveByDefault,
      onClearAll,
      onApply,
    }
  },
})
</script>

<style lang="scss" scoped>
.field-generator {
  :deep(label) {
    margin-bottom: 0;
  }
}

.save-btn {
  margin-left: 1.5rem;
}

.filters-block-small {
  :deep(.card) {
    margin-bottom: 1rem;

    .card-header {
      padding: 0.5rem 1rem;
    }

    .card-body {
      padding: 1rem;
    }

    .card-footer {
      padding: 1rem;

      .save-btn {
        margin: 0 1rem;
      }
    }
  }
}
</style>
