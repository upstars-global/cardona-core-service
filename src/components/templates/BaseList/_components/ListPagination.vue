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
  (event: 'input', payload: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const currentPage = computed({
  get: () => props.modelValue,
  set: value => {
    emits('input', value)
  },
})

const numberOfPages = computed(() => props.paginationConfig.numberOfPages.value)
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      sm="6"
      class="d-flex align-items-center justify-content-center justify-content-sm-start p-0"
    >
      <span class="text-muted">
        {{ $t('pagination.showing') }}
      </span>
    </VCol>

    <VCol
      cols="12"
      sm="6"
      class="d-flex align-items-center justify-content-center justify-content-sm-end p-0"
    >
      <VPagination
        v-model="currentPage"
        :total-visible="numberOfPages"
        :length="paginationConfig.total"
        rounded="circle"
      />
    </vcol>
  </VRow>
</template>
