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
  <VRow class="align-center">
    <VCol
      cols="12"
      sm="6"
      class="d-flex align-center justify-content-center justify-content-sm-start p-0"
    >
      <span class="text-muted">
        {{ $t('pagination.showing', dataMeta) }}
      </span>
    </VCol>

    <VCol
      cols="12"
      sm="6"
      class="d-flex align-center justify-content-center px-0 py-0"
    >
      <VPagination
        v-model="currentPage"
        :length="total"
        :total-visible="6"
        rounded="circle"
        class="ml-auto"
      />
    </vcol>
  </VRow>
</template>
