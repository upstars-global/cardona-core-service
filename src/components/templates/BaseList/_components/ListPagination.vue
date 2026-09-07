<script setup lang="ts">
import { computed, ref } from 'vue'
import { clamp } from 'lodash'
import type { PaginationResult } from '../сomposables/pagination'
import { getMappedValueByManyMethods, toIntegerNumbers, toPositiveNumbers } from '../../../../helpers'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors, VVariants } from '../../../../@model/vuetify'
import type { NumberOrString } from '../../../../@model'
import AppTextField from '../../../../@core/components/app-form-elements/AppTextField.vue'
import CPagination from './CPagination.vue'

interface Props {
  paginationConfig: PaginationResult
  linkGen?: Function
  dataMeta: { from: number; to: number; of: number }
  small?: boolean
  classShowing?: string
  withGoToPage?: boolean
}

const props = defineProps<Props>()

const currentPage = defineModel<number>()

const goToPageValue = ref<NumberOrString>('')

const numberOfPages = computed(
  () => Math.ceil(+props.paginationConfig.total.value / props.paginationConfig.perPage.value) || 0,
)

const isGoToPageShown = computed(() => props.withGoToPage && numberOfPages.value > 1)

const localGoToPageValue = computed({
  get: () => goToPageValue.value,
  set: (value: NumberOrString) => {
    goToPageValue.value = getMappedValueByManyMethods(value, [toPositiveNumbers, toIntegerNumbers])
  },
})

const disabledKeys = computed(() => ['e', '.', ',', '-', !goToPageValue.value.toString() && '0'])

const onKeyDown = (event: KeyboardEvent) => {
  if (disabledKeys.value.includes(event.key))
    event.preventDefault()
}

const onWheel = (event: WheelEvent) => {
  (event.target as HTMLInputElement).blur()
}

const goToPageInput = ref()

const goToPage = () => {
  const page = Number(goToPageValue.value)

  if (!goToPageValue.value.toString() || Number.isNaN(page))
    return

  const targetPage = clamp(page, 1, numberOfPages.value)

  goToPageValue.value = ''
  goToPageInput.value?.$el?.querySelector('input')?.focus()

  currentPage.value = targetPage
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
      <span
        class="text-body-1 text-medium-emphasis	text-no-wrap"
        data-test-id="pagination-meta"
        :class="classShowing"
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

      <div
        v-if="isGoToPageShown"
        class="d-flex align-center go-to-page"
        data-test-id="pagination-go-to"
      >
        <VDivider
          vertical
          class="mx-4 go-to-page__divider"
        />

        <span class="text-body-1 text-medium-emphasis text-no-wrap mr-1">
          {{ $t('pagination.goTo') }}
        </span>

        <AppTextField
          ref="goToPageInput"
          v-model.trim="localGoToPageValue"
          type="number"
          autocomplete="off"
          :color="VColors.Primary"
          hide-details
          class="go-to-page__input app-text-field--small"
          data-test-id="pagination-go-to-input"
          @keydown="onKeyDown"
          @keydown.enter="goToPage"
          @wheel="onWheel"
        />

        <VBtn
          :variant="VVariants.Tonal"
          :color="VColors.Primary"
          class="ml-1 go-to-page__button"
          data-test-id="pagination-go-to-button"
          @click="goToPage"
        >
          <VIcon :icon="IconsList.ArrowRight" />
        </VBtn>
      </div>
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

.go-to-page {
  &__divider {
    align-self: center;
    height: 1.375rem;
    min-height: 1.375rem;
    max-height: 1.375rem;
    margin-block: 0;
  }

  &__input {
    width: 4.5rem;
    min-width: 4.5rem;
    flex: 0 0 auto;
    align-self: center;

    :deep(.v-field--focused.v-field--variant-outlined) {
      .v-field__outline__start,
      .v-field__outline__notch::before,
      .v-field__outline__notch::after,
      .v-field__outline__end {
        border-color: rgb(var(--v-theme-primary));
      }
    }
  }

  &__button {
    min-width: 2rem;
    width: 2rem;
    height: 2rem;
    padding: 0;
  }
}
</style>
