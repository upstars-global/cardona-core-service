<script setup lang="ts">
import { computed } from 'vue'
import type { PaginationResult } from '@/use/pagination'

interface Props {
  paginationConfig: PaginationResult
  linkGen?: Function
  dataMeta: { from: number; to: number; of: number }
  modelValue: number
}

interface Emits {
  (e: 'update:modelValue', payload: number): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const LARGE_SIZE_BUTTON = 1000

const total = computed(() => {
  return Math.ceil(+props.paginationConfig.total.value / props.paginationConfig.perPage.value) || 0
})

const currentPage = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:modelValue', value)
  },
})
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
        :total-visible="6"
        rounded="circle"
        class="ml-auto"
      />
    </vcol>
  </VRow>
</template>

<style scoped lang="scss">
.pagination-text {
  color: rgba(var(--v-theme-grey-900), var(--v-muted-placeholder-opacity));
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
