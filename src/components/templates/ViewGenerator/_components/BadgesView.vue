<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import type { ViewInfo } from '../../../../@model/view'
import { IconsList } from '../../../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../../../@model/vuetify'

const props = defineProps<{
  item: ViewInfo
}>()

const { t } = useI18n()
const localSearch = ref('')
const isCollapsedList = ref(true)

const maxShowItem = 10

const filteredList = computed(() => {
  if (!props.item.withSearch || localSearch.value === '')
    return props?.item?.value

  return props.item.value.filter(item => {
    return item.name.startsWith(localSearch.value)
  })
})

const itemsList = computed(() => {
  return isCollapsedList.value ? filteredList.value.slice(0, maxShowItem) : filteredList.value
})

const onToggleShowList = () => {
  isCollapsedList.value = !isCollapsedList?.value
}

const toggleLabel = computed(() => {
  return isCollapsedList.value ? t('common.showMore') : t('common.showLess')
})

const isShowToggleButton = computed(() => {
  return filteredList.value?.length > maxShowItem
})
</script>

<template>
  <div class="full-width">
    <div
      v-if="item.withSearch"
      class="input-field mb-2"
    >
      <VTextField
        v-model="localSearch"
        :prepend-inner-icon="IconsList.SearchIcon"
        :placeholder="$t('placeholder.search._')"
        :variant="VVariants.Outlined"
      />
    </div>
    <Transition
      name="fade"
      mode="out-in"
    >
      <PerfectScrollbar
        v-if="itemsList && Array.isArray(itemsList)"
        :key="itemsList.length"
        class="chip-list"
      >
        <div class="d-flex flex-wrap gap-2 mb-1">
          <VChip
            v-for="(itemArr, key) in itemsList"
            :key="key"
            label
            :variant="VVariants.Tonal"
            :size="VSizes.Small"
            class="font-weight-medium px-2 overflow-visible label-chip text-grey-500"
          >
            {{ itemArr.name }}
          </VChip>
          <VChip
            v-if="isShowToggleButton"
            label
            :color="VColors.Primary"
            :variant="VVariants.Tonal"
            :size="VSizes.Small"
            class="cursor-pointer px-2"
            @click="onToggleShowList"
          >
            {{ toggleLabel }}
          </VChip>
        </div>
      </PerfectScrollbar>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.chip-list {
  width: 17.8rem;
  .label-chip {
    min-width: auto;
    max-width: initial;
  }
}
</style>
