<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ViewInfo } from '../../../../@model/view'
import { IconsList } from '../../../../@model/enums/icons'

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

const toggleIcon = computed(() => {
  return isCollapsedList.value ? IconsList.PlusSquareIcon : IconsList.MinusSquareIcon
})

const isShowToggleButton = computed(() => {
  return filteredList.value.length > maxShowItem
})
</script>

<template>
  <div class="full-width">
    <div
      v-if="item.withSearch"
      class="mb-50"
    >
      <VTextField
        v-model="localSearch"
        :prepend-inner-icon="IconsList.SearchIcon"
        :placeholder="$t('placeholder.search._')"
        variant="outlined"
      />
    </div>
    <Transition
      name="fade"
      mode="out-in"
    >
      <div :key="itemsList.length">
        <VChip
          v-for="(itemArr, key) in itemsList"
          :key="key"
          variant="light-secondary"
          class="mr-50 mb-50"
        >
          {{ itemArr.name }}
        </VChip>
        <VChip
          v-if="isShowToggleButton"
          variant="light-primary"
          size="sm"
          class="cursor-pointer"
          @click="onToggleShowList"
        >
          {{ toggleLabel }}
          <VIcon
            :icon="toggleIcon"
            class="mr-50"
          />
        </VChip>
      </div>
    </Transition>
  </div>
</template>
