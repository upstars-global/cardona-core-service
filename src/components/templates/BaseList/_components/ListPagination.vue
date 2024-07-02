<script setup lang="ts">
import { computed } from 'vue'
import { VSizes, VVariants } from '../../../../@model/vuetify'
import type { PaginationResult } from '@/use/pagination'

interface Props {
  paginationConfig: PaginationResult
  linkGen?: Function
  dataMeta: { from: number; to: number; of: number }
  modelValue: number
  small: boolean
}

interface VPaginationItem {
  isActive: boolean
  key: string | number
  page: string
  props: Record<string, any>
}

interface Emits {
  (e: 'update:modelValue', payload: number): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const LARGE_SIZE_BUTTON = 1000
const BUTTON_SIZE = 40

const total = computed(() => {
  return Math.ceil(+props.paginationConfig.total.value / props.paginationConfig.perPage.value) || 0
})

const totalVisible = computed(() => props.small ? 4 : 6)

const currentPage = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:modelValue', value)
  },
})

const getNumberOfPage = ({ page }) => {
  if (page.includes('...'))
    return page

  return page.replace(/[^0-9]/g, '')
}

const isEllipsis = (item: VPaginationItem) => item.page.includes('...')

const setActivePage = (item: VPaginationItem) => {
  if (isEllipsis(item))
    return
  currentPage.value = getNumberOfPage(item)
}

const paramsOfSize = (item: VPaginationItem) => {
  if (isEllipsis(item))
    return { size: BUTTON_SIZE }

  return item.page?.length >= 4 ? { height: BUTTON_SIZE } : { size: BUTTON_SIZE }
}
</script>

<template>
  <VRow
    class="align-center"
    no-gutters
  >
    <VCol
      cols="12"
      sm="4"
      class="d-flex align-center justify-start justify-content-sm-start px-0"
    >
      <span class="pagination-text">
        {{ $t('pagination.showing', dataMeta) }}
      </span>
    </VCol>

    <VCol
      cols="12"
      sm="8"
      class="d-flex align-center justify-center px-0"
      :class="{ 'is-longer-item': LARGE_SIZE_BUTTON < total }"
    >
      <VPagination
        v-if="total"
        v-model="currentPage"
        :length="total"
        :total-visible="totalVisible"
        :size="small ? VSizes.Small : VSizes.Medium"
        rounded="circle"
        class="ml-auto pagination"
      >
        <template #item="item">
          <VBtn
            v-bind="paramsOfSize(item)"
            :variant="VVariants.Tonal"
            :color="item.isActive ? 'primary' : 'secondary'"
            class="pagination--button"
            rounded
            :class="{ 'long-number': item.page.length >= 3 && !isEllipsis(item), [`number-length-${item.page.length}`]: item.page.length < 4 }"
            @click="setActivePage(item)"
          >
            {{ getNumberOfPage(item) }}
          </VBtn>
        </template>
      </VPagination>
    </Vcol>
  </VRow>
</template>

<style scoped lang="scss">
.pagination-text {
  color: rgba(var(--v-theme-grey-900), var(--v-muted-placeholder-opacity));
}
.pagination {
  &--buton {
    border-radius: 100%;
    width: initial
  }
}

.pagination--button {
  border-radius: 100%;
  width: initial;
}

.number-length-1 { padding-inline: calc(1rem - 2px) }
.number-length-2 { padding-inline: 0.75rem }
.long-number {
  border-radius: 100% !important;
  width: auto !important;
  padding: 0 !important;
  :deep(span) {
    padding: 0 0.5rem;
    border-radius: 6.25rem;
  }
}
.is-longer-item {
  :deep(.v-pagination__list) {
    .v-pagination__item:nth-child(8) {
      button {
        border-radius: initial;
        width: auto;
        span {
          padding: 0 0.5rem;
          border-radius: 6.25rem;
        }
      }
    }
  }
}
</style>
