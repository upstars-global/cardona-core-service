<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash'
import useToastService from '../../helpers/toasts'
import FieldGenerator from '../../components/templates/FieldGenerator/index.vue'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import type { BaseField } from '../../@model/templates/baseField'
import type { IDefaultFilter } from '../../@model/filter'
import FilterSelector from './_components/FilterSelector.vue'

const props = withDefaults(defineProps<{
  entityName: string
  filters: BaseField[]
  isOpen?: boolean
  size?: VSizes
}>(), {
  size: VSizes.Medium,
})

const emits = defineEmits<{
  (e: 'apply'): void
  (e: 'change-selected-filters', filters: BaseField[]): void
}>()

const store = useStore()
const route = useRoute()
const { toastSuccess } = useToastService()

const { name: pageName } = route
const keyStorage = `${pageName}_${props.entityName}`

const selectedFilters = ref<BaseField[]>([])

const isSmallBlock: boolean = props.size === VSizes.Small

const onChange = (filter: BaseField) => selectedFilters.value.push(cloneDeep(filter))

const onApply = () => {
  store.commit('filtersCore/SET_LIST_ENTITY_NAME', props.entityName)
  store.commit('filtersCore/SET_LIST_PATH', route.path)
  store.commit('filtersCore/SET_LIST_FILTERS', selectedFilters.value)

  emits('apply')
}

const onRemoveFilter = ({ key }: BaseField) => {
  selectedFilters.value = selectedFilters.value.filter(filter => filter.key !== key)

  onApply()
}

const onClearAll = () => {
  selectedFilters.value = []

  onApply()
}

watch(selectedFilters, filters => {
  emits('change-selected-filters', filters)
}, { deep: true })

onMounted(async () => {
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
  else {
    const filtersSavedByDefault: IDefaultFilter[] = await store.dispatch('filtersCore/fetchDefaultFilters')
    const currentListFilters: IDefaultFilter | undefined = filtersSavedByDefault.find(({ type }) => type === keyStorage)

    if (currentListFilters) {
      selectedFilters.value = props.filters.filter(({ key }: BaseField) =>
        currentListFilters.fields.includes(key),
      )

      emits('change-selected-filters', selectedFilters.value)
    }
  }
})

const selectedFiltersKeys = computed(() => {
  return selectedFilters.value.map(({ key }) => key)
})

const onSaveByDefault = async () => {
  const savedFilter: IDefaultFilter = { type: keyStorage, fields: selectedFiltersKeys.value }

  await store.dispatch('filtersCore/setDefaultFilter', savedFilter)

  toastSuccess('filtersSavedByDefault')
}

const listNotSelected = computed(() => {
  return props.filters.filter(({ key }) => !selectedFiltersKeys.value.includes(key))
})
</script>

<template>
  <VRow
    no-gutters
    data-test-id="main-wrapper"
    :class="{ 'mb-6': isOpen }"
  >
    <VCol
      class="p-0"
      :class="{ 'filters-block-small': isSmallBlock }"
    >
      <VCard
        v-if="isOpen"
        no-body
      >
        <VCardItem
          class="py-4"
          data-test-id="filter-title"
        >
          <VRow
            justify="space-between"
            align="center"
          >
            <VCol>
              <h4 class="mb-0 text-h5">
                {{ $t('common.filter.filtrate') }}
              </h4>
            </VCol>
            <VCol class="d-flex justify-end">
              <FilterSelector
                :filters="listNotSelected"
                :size="size"
                @selected-filters-changed="onChange"
              />
            </VCol>
          </VRow>
        </VCardItem>
        <div
          v-if="selectedFilters.isNotEmpty"
          class="block-with-selected-filter-items"
        >
          <hr class="my-0 mb-3">

          <div class="pa-4 px-6">
            <VRow
              v-for="(filter, key) in selectedFilters"
              :key="key"
              :class="{ 'pt-4': key }"
              data-test-id="filter-row"
            >
              <VCol
                md="3"
                class="d-flex align-center py-0"
              >
                <p
                  class="text-h6 text-button mb-0 font-weight-medium filter-label"
                  :class="{ 'font-small-3': isSmallBlock }"
                >
                  {{ filter.label }}
                </p>
              </VCol>

              <VCol
                md="9"
                class="d-flex align-center py-0"
              >
                <slot :name="`filter(${selectedFilters[key].key})`" :index="key" :selectedFilters="selectedFilters" :size="size">
                  <FieldGenerator
                    v-model="selectedFilters[key]"
                    :with-label="false"
                    :size="size"
                    class="field-generator mr-4 full-width"
                  />
                </slot>
                <VBtn
                  :variant="VVariants.Text"
                  :color="VColors.Error"
                  class="v-btn--rectangle"
                  :size="40"
                  @click="onRemoveFilter(filter)"
                >
                  <VIcon :icon="IconsList.Trash2Icon" />
                </VBtn>
              </VCol>
            </VRow>
          </div>

          <hr class="my-0 mt-3">
          <VCardActions class="px-6 py-4">
            <div class="d-flex w-100 gap-4">
              <VBtn
                :color="VColors.Success"
                :variant="VVariants.Elevated"
                class="ml-0 px-4"
                :size="size"
                data-test-id="apply-btn"
                @click="onApply"
              >
                {{ $t('action.applyFilters') }}
              </VBtn>
              <VBtn
                :color="VColors.Secondary"
                :variant="VVariants.Outlined"
                class="ml-0 px-4"
                :size="size"
                data-test-id="save-by-default-btn"
                @click="onSaveByDefault"
              >
                {{ $t('action.saveAsDefault') }}
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
        </div>
      </VCard>

      <div
        v-else-if="selectedFilters.length"
        data-test-id="applied-filters-wrapper"
        class="d-flex flex-wrap align-center pb-6 gap-2"
      >
        <span class="font-small-3 font-weight-bold text-body-heading">
          {{ $t('common.filter.appliedFilters') }}
        </span>
        <VChip
          v-for="filter in selectedFilters"
          :key="filter.key"
          label
          :color="VColors.Secondary"
          data-test-id="applied-filters-item"
          closable
          @click:close="onRemoveFilter(filter)"
        >
          {{ filter.label }}
          <span v-if="Array.isArray(filter.value) && filter.value.length && filter.type !== 'sum-range'">
            ({{ filter.value.length }})
          </span>
        </VChip>
        <VChip
          v-if="selectedFilters.length > 5"
          label
          :color="VColors.Error"
          data-test-id="remove-all-filters"
          @click="onClearAll"
        >
          {{ $t('action.clearAll') }}
        </VChip>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.field-generator {
  :deep(label) {
    margin-bottom: 0;
    color: rgba(var(--v-theme-grey-900), var(--v-body-opacity));
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

.filter-label {
  text-transform: none !important;
}
</style>
