<script setup lang="ts">
import type { PaginationResult } from '../сomposables/pagination'
import CPagination from './CPagination.vue'

interface Props {
  paginationConfig: PaginationResult
  linkGen?: Function
  dataMeta: { from: number; to: number; of: number }
  small?: boolean
}

defineProps<Props>()

const currentPage = defineModel<number>()
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
      <span
        class="text-body-1 text-medium-emphasis	text-no-wrap"
        data-test-id="pagination-meta"
      >
        {{ $t('pagination.showing', dataMeta) }}
      </span>
    </VCol>

    <VCol
      cols="12"
      sm="8"
      class="d-flex align-center justify-center px-0"
    >
      <CPagination
        v-model="currentPage"
        :pagination-config="paginationConfig"
        :small="small"
      />
    </Vcol>
  </VRow>
</template>

<style scoped lang="scss">
.pagination {
  :deep(ul) {
    li {
      button {
        border-radius: 100% !important;
        min-width: 2rem;
        height: 2rem;
        padding: 0 6px;
        width: auto;
        font-size: 13px;
      }
    }
  }
  :deep(.v-pagination__list) {
    align-items: center;
  }
}
</style>
