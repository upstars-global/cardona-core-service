<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import type { ViewInfo } from '../../../../@model/view'
import { isEmpty } from '../../../../@core/utils/helpers'

const props = defineProps<{
  item: ViewInfo
}>()

const store = useStore()

onBeforeMount(() => {
  const countryList = store.getters['regions/countryList']?.list
  if (!countryList || isEmpty(countryList))
    store.dispatch('regions/fetchCountriesList')
})

const region = computed(() =>
  store.getters['regions/countryList']?.list?.find(
    region => region.id === props.item.value,
  )?.name || '-',
)
</script>

<template>
  <span>{{ region }}</span>
</template>
