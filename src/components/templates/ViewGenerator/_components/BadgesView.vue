<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import { computed, ref } from 'vue'
import { useUtils as useI18nUtils } from '../../../../@core/libs/i18n'
import { IconsList } from '../../../../@model/enums/icons'

const { t } = useI18nUtils()
const props = defineProps<{
  item: ViewInfo
}>()

const localSearch = ref('')
const isCollapsedList = ref(true)

const maxShowItem = 10
const filteredList = computed(() => {
  if (!props.item.withSearch || localSearch.value === '') return props?.item?.value

  return props.item.value.filter((item) => {
    return item.name.startsWith(localSearch.value)
  })
})
const itemsList = computed(() => {
  return isCollapsedList.value ? filteredList.value.slice(0, maxShowItem) : filteredList.value
})
const listCount = computed(() => `(${props?.item?.value?.length})`)

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
    <div v-if="item.withSearch" class="mb-50">
      <b-input-group size="sm" class="input-group-merge search-group">
        <b-input-group-prepend is-text>
          <feather-icon :icon="IconsList.SearchIcon" />
        </b-input-group-prepend>

        <b-form-input v-model="localSearch" :placeholder="$t('placeholder.search._')" />
      </b-input-group>
    </div>
    <transition name="fade" mode="out-in">
      <div :key="itemsList.length">
        <b-badge
          v-for="(itemArr, key) in itemsList"
          :key="key"
          variant="light-secondary"
          class="mr-50 mb-50"
        >
          {{ itemArr.name }}
        </b-badge>
        <b-badge
          v-if="isShowToggleButton"
          variant="light-primary"
          size="sm"
          class="cursor-pointer"
          @click="onToggleShowList"
        >
          {{ toggleLabel }}
          <feather-icon :icon="toggleIcon" class="mr-50" />
        </b-badge>
      </div>
    </transition>
  </div>
</template>


