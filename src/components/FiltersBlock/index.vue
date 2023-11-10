<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import store from '../../store'
import { setStorage } from '../../helpers/storage'
import useToastService from '../../helpers/toasts'
import type { Filter } from '../../@model/filter'
import FieldGenerator from '../../components/templates/FieldGenerator/index.vue'
import { IconsList } from '../../@model/enums/icons'
import FilterSelector from './_components/FilterSelector.vue'
import { VColors, VVariants } from '@/@model/vuetify'

const props = defineProps<{
  entityName: string
  filters: Filter[]
  isOpen?: boolean
  size: string // TODO: refactor sizes
}>()

const emits = defineEmits<{
  (e: 'apply'): void
  (e: 'changeSelectedFilters', filters: Filter[]): void
}>()

const route = useRoute()
const { toastSuccess } = useToastService()

const { name: pageName } = route
const keyStorage = `${pageName}-${props.entityName}-list-filters`

const selectedFilters = ref<Filter[]>([])

const isSmallBlock: boolean = props.size === 'sm' // TODO: refactor sizes
const headerTag: string = isSmallBlock ? 'h5' : 'h4'

const onChange = (filter: Filter) => selectedFilters.value.push(filter)

const onApply = () => {
  store.commit('filtersCore/SET_LIST_ENTITY_NAME', props.entityName)
  store.commit('filtersCore/SET_LIST_PATH', route.path)
  store.commit('filtersCore/SET_LIST_FILTERS', selectedFilters.value)

  emits('apply')
}

const onRemoveFilter = ({ key }: Filter) => {
  selectedFilters.value = selectedFilters.value.filter(filter => filter.key !== key)

  onApply()
}

const onClearAll = () => {
  selectedFilters.value = []

  onApply()
}

watch(selectedFilters, filters => {
  emits('changeSelectedFilters', filters)
})

onMounted(() => {
  const initFiltersStorage = localStorage.getItem(keyStorage)
  const isSamePath = route.path === store.getters['filtersCore/listPath']
  const isSameEntity = props.entityName === store.getters['filtersCore/listEntityName']

  if (!isSamePath || !isSameEntity) {
    store.commit('filtersCore/SET_LIST_ENTITY_NAME')
    store.commit('filtersCore/SET_LIST_PATH')
    store.commit('filtersCore/SET_LIST_FILTERS')
  }

  if (store.getters['filtersCore/appliedListFilters'].length) {
    selectedFilters.value = store.getters['filtersCore/appliedListFilters']
  }
  else if (initFiltersStorage) {
    selectedFilters.value = props.filters.filter(({ key }: Filter) =>
      initFiltersStorage?.includes(key),
    )

    emits('changeSelectedFilters', selectedFilters.value)
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
</script>

<template>
  <VRow no-gutters>
    <VCol
      class="p-0"
      :class="{ 'filters-block-small': isSmallBlock }"
    >
      <VCard
        v-if="isOpen"
        no-body
      >
        <VCardItem>
          <Component
            :is="headerTag"
            class="mb-0"
          >
            {{ $t('common.filter.filtrate') }}
          </Component>
        </VCardItem>

        <VCardText>
          <VCol class="pl-0 pr-0">
            <VRow no-gutters>
              <VCol
                cols="12"
                md="3"
                class="mb-md-0 mb-2"
              >
                <FilterSelector
                  :filters="listNotSelected"
                  :size="size"
                  @selected-filters-changed="onChange"
                />
              </VCol>
            </VRow>

            <VRow
              v-for="(filter, key) in selectedFilters"
              :key="key"
              class="mt-2"
            >
              <VCol
                md="3"
                class="d-flex align-items-center"
              >
                <p
                  class="font-weight-bolder mb-0"
                  :class="{ 'font-small-3': isSmallBlock }"
                >
                  {{ filter.label }}
                </p>
              </VCol>

              <VCol
                md="9"
                class="d-flex align-items-center"
              >
                <FieldGenerator
                  v-model="selectedFilters[key]"
                  :with-label="false"
                  :size="size"
                  class="field-generator mr-1 w-100"
                />
                <VBtn
                  :variant="VVariants.Outlined"
                  :color="VColors.Error"
                  class="btn-icon"
                  :size="size"
                  @click="onRemoveFilter(filter)"
                >
                  <VIcon :icon="IconsList.Trash2Icon" />
                </VBtn>
              </VCol>
            </VRow>
          </VCol>
        </VCardText>

        <hr>
        <VCardActions class="px-5 py-4">
          <div class="d-flex w-100 gap-4">
            <VBtn
              :color="VColors.Success"
              :variant="VVariants.Elevated"
              class="ml-0 px-4"
              @click="onApply"
            >
              {{ isSmallBlock ? $t('action.apply') : $t('action.applyFilters') }}
            </VBtn>
            <VBtn
              :color="VColors.Secondary"
              :variant="VVariants.Outlined"
              class="ml-0 px-4"
              @click="onSaveByDefault"
            >
              {{ $t('action.saveByDefault') }}
            </VBtn>

            <VBtn
              :color="VColors.Error"
              :variant="VVariants.Outlined"
              class="white-space-nowrap ml-auto px-4"
              :size="size"
              @click="onClearAll"
            >
              {{ $t('action.clearAll') }}
            </VBtn>
          </div>
        </VCardActions>
      </VCard>

      <div
        v-else-if="selectedFilters.length"
        class="d-flex flex-wrap align-items-center pb-1"
      >
        <span class="font-small-3 font-weight-bold text-body-heading mr-1 mb-50">
          {{ $t('common.filter.appliedFilters') }}
        </span>
        <VChip
          v-for="filter in selectedFilters"
          :key="filter.key"
          class="mr-1 mb-50"
          label
          :color="VColors.Secondary"
        >
          {{ filter.label }}

          <span
            v-if="Array.isArray(filter.value) && filter.value.length && filter.type !== 'sum-range'"
            class="ml-20"
          >
            ({{ filter.value.length }})
          </span>
        </VChip>
      </div>
    </VCol>
  </VRow>
</template>

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
