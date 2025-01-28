<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { debounce } from 'lodash'
import { useToggle } from '@vueuse/core'
import type { OptionsItem } from '../../../../@model'
import { BSize } from '../../../../@model/bootstrap'
import type { MultiSelectBaseField } from '../../../../@model/templates/baseField'
import { i18n } from '../../../../plugins/i18n'
import { withPopper } from '../../../../helpers/selectPopper'
import { IconsList } from '../../../../@model/enums/icons'
import { copyToClipboard } from '../../../../helpers/clipboard'
import { useInfiniteScroll } from '../../../../helpers/infiniteScroll'

interface MultiselectProps {
  modelValue: OptionsItem[] | string[] | number[]
  field: MultiSelectBaseField
  errors?: boolean
  disabled?: boolean
  size?: BSize
  placeholder?: string
}

const props = withDefaults(defineProps<MultiselectProps>(), {
  modelValue: () => [],
  size: BSize.Md,
  placeholder: i18n.t('placeholder.choose._') as string,
})

const emits = defineEmits<{
  (event: 'update:modelValue', item: OptionsItem[]): void
}>()

const isLoading = ref(false)
const toggleDropDownState = useToggle()[1]

const valueModel = computed<OptionsItem[]>({
  get: () =>
    props.modelValue.map(item =>
      typeof item === 'string' || typeof item === 'number'
        ? props.field.options?.find((option: OptionsItem) => option.id == item)
        : item,
    ),
  set: (item: OptionsItem[]) => emits('update:modelValue', item),
})

const selectClasses = computed(() => {
  const size = props.size ? `select-size-${props.size}` : null

  const classes = {
    error: props.errors,
  }

  return [size, classes]
})

// Options
const options = computed(() =>
  props.field.options
    ? props.field.options.filter((option: OptionsItem) =>
      valueModel.value.every(item => item?.id !== option.id),
    )
    : [],
)

watch(
  () => props.field.options,
  async () => {
    if (!props.field.options) {
      isLoading.value = true

      await props.field.fetchOptions()

      isLoading.value = false
    }
  },
  { deep: true, immediate: true },
)

const searchValue = ref('')

// Handlers
const onSearch = debounce(async (search: string, loading: Function) => {
  loading(true)

  try {
    searchValue.value = search
    await props.field.fetchOptions(search)
  }
  finally {
    loading(false)
    if (isInfiniteLoadingEnabled.value)
      await reInitObserver()
  }
}, 250)

const loadRef = ref<HTMLElement>()

const onOpen = async () => {
  toggleDropDownState()
  if (isInfiniteLoadingEnabled.value)
    await setupObserver()
}

const onClose = () => {
  toggleDropDownState()
  abortObserver()
}

const isInfiniteLoadingEnabled = computed(() => props.field.infiniteLoading)

const showLoadMore = computed((): boolean =>
  isInfiniteLoadingEnabled.value
  && !!props.field.options?.length
  && !searchValue.value
  && !isLoading.value,
)

const {
  setupObserver,
  reInitObserver,
  abortObserver,
} = useInfiniteScroll(showLoadMore.value, () => props.field.loadMore(), loadRef)
</script>

<template>
  <div>
    <VueSelect
      v-model="valueModel"
      :placeholder="placeholder"
      label="name"
      :loading="isLoading"
      multiple
      :options="options"
      :class="selectClasses"
      :disabled="disabled"
      :append-to-body="field.appendToBody"
      :calculate-position="withPopper(field.calculatePositionCb)"
      :filterable="field.filterable"
      @search="onSearch"
      @open="onOpen"
      @close="onClose"
    >
      <template #selected-option="{ id, name }">
        <span class="mr-1">
          {{ name }}
        </span>

        <div v-if="field.withCopyId">
          <VIcon
            :icon="IconsList.CopyIcon"
            class="cursor-pointer text-primary"
            size="16"
            @click.stop="copyToClipboard(id)"
            @mousedown.stop
          />

          <VTooltip
            location="bottom"
            :text="$t('component.multiSelect.copyId')"
            activator="parent"
          />
        </div>
      </template>

      <template #no-options="{ loading, search }">
        <div v-if="!search && !loading">
          {{ $t('common.enterSomething') }}
        </div>

        <div v-else>
          {{ $t('common.nothingFound') }}
        </div>
      </template>
      <template #open-indicator="{ attributes }">
        <VIcon
          v-bind="attributes"
          :icon="IconsList.ChevronDownIcon"
        />
      </template>
      <template #list-footer>
        <li
          v-show="showLoadMore"
          ref="loadRef"
          class="loader"
        >
          Loading more options...
        </li>
      </template>
    </VueSelect>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  padding: 10px;
  text-align: center;
  font-size: 14px;
  color: #999;
}
</style>
