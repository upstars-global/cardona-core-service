<script setup lang="ts">
import { computed } from 'vue'
import { VColors, VSizes, VVariants } from '../../../../@model/vuetify'
import type { PaginationResult } from '../сomposables/pagination'

const props = defineProps<{
  paginationConfig: PaginationResult
  small?: boolean
}>()

interface VPaginationItem {
  isActive: boolean
  key: string | number
  page: string
  props: Record<string, any>
}

const currentPage = defineModel<number>()

const totalVisible = computed(() => props.small ? 4 : 6)
const actualSize = computed(() => props.small ? VSizes.Small : VSizes.Medium)

const total = computed(() => Math.ceil(+props.paginationConfig.total.value / props.paginationConfig.perPage.value) || 0)

const isEllipsis = (item: VPaginationItem): boolean => item.page.includes('...')

const setActivePage = (item: VPaginationItem) => {
  if (isEllipsis(item))
    return

  currentPage.value = getNumberOfPage(item)
}

const getDataTestId = (buttonText: VPaginationItem): string => isEllipsis(buttonText) ? 'ellipsis' : `page-${getNumberOfPage(buttonText)}`

const getNumberOfPage = ({ page }: VPaginationItem) => {
  if (page.includes('...'))
    return page

  return +page.replace(/[^0-9]/g, '')
}
</script>

<template>
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
        :color="item.isActive ? VColors.Primary : VColors.Secondary"
        rounded="circle"
        :disabled="isEllipsis(item)"
        :data-test-id="getDataTestId(item)"
        @click="setActivePage(item)"
      >
        {{ getNumberOfPage(item) }}
      </VBtn>
    </template>
  </VPagination>
</template>
