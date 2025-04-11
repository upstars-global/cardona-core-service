<script setup lang="ts">
import { computed } from 'vue'
import { VSizes, VVariants } from '../../../../@model/vuetify'
import type { PaginationResult } from '../сomposables/pagination'

interface Props {
  paginationConfig: PaginationResult
  linkGen?: Function
  dataMeta: { from: number; to: number; of: number }
  modelValue: number
  small?: boolean
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

  return +page.replace(/[^0-9]/g, '')
}

const isEllipsis = (item: VPaginationItem) => item.page.includes('...')

const setActivePage = (item: VPaginationItem) => {
  if (isEllipsis(item))
    return
  currentPage.value = getNumberOfPage(item)
}

const actualSize = computed(() => props.small ? VSizes.Small : VSizes.Medium)

const getDataTestId = (buttonText: VPaginationItem): string => isEllipsis(buttonText) ? 'ellipsis' : `page-${getNumberOfPage(buttonText)}`
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
      <VPagination
        v-if="total"
        v-model="currentPage"
        :length="total"
        :total-visible="totalVisible"
        :size="actualSize"
        rounded="circle"
        class="ml-auto pagination"
      >
        <template #item="item">
          <VBtn
            :variant="VVariants.Tonal"
            :color="item.isActive ? 'primary' : 'secondary'"
            class="pagination--button"
            rounded="circle"
            :disabled="isEllipsis(item)"
            :data-test-id="getDataTestId(item)"
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
.pagination {
  :deep(ul) {
    li {
      button {
        border-radius: 100px !important;
        min-width: 32px !important;
        height: 32px !important;
        border-radius: 100px !important;
        padding: 0 6px !important;
        width: auto !important;
        font-size: 13px;
      }
    }
  }
  :deep(.v-pagination__list) {
    align-items: center;
  }
}
</style>
