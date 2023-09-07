<script setup lang="ts">
import { computed } from 'vue'
import { IconsList } from '../../../../@model/enums/icons'
import { PaginationResult } from '../../../../use/pagination'

interface Props {
  paginationConfig: PaginationResult
  linkGen?: Function
  dataMeta: { from: number; to: number; of: number }
  value: number
}

interface Emits {
  (event: 'input', payload: number): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const currentPage = computed({
  get: () => props.value,
  set: (value) => {
    emits('input', value)
  },
})

const numberOfPages = computed(() => props.paginationConfig.numberOfPages.value)
</script>

<template>
  <b-row>
    <b-col
      cols="12"
      sm="6"
      class="d-flex align-items-center justify-content-center justify-content-sm-start p-0"
    >
      <span class="text-muted">
        {{ $t('pagination.showing', dataMeta) }}
      </span>
    </b-col>

    <b-col
      cols="12"
      sm="6"
      class="d-flex align-items-center justify-content-center justify-content-sm-end p-0"
    >
      <b-pagination-nav
        v-if="numberOfPages"
        v-model="currentPage"
        first-number
        last-number
        class="pagination-nav mb-0 mt-1 mt-sm-0"
        prev-class="prev-item"
        next-class="next-item"
        :link-gen="linkGen || props.paginationConfig.linkGen"
        :number-of-pages="numberOfPages"
        use-router
      >
        <template #prev-text>
          <feather-icon :icon="IconsList.ChevronLeftIcon" size="18" />
        </template>

        <template #next-text>
          <feather-icon :icon="IconsList.ChevronRightIcon" size="18" />
        </template>
      </b-pagination-nav>
    </b-col>
  </b-row>
</template>
