<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import store from '../../../../store'
import type { ViewInfo } from '../../../../@model/view'

const props = defineProps<{
  item: ViewInfo
}>()

onBeforeMount(() => {
  if (store.getters['regions/countryList'].list.isEmpty)
    store.dispatch('regions/fetchCountriesList')
})

const region = computed(
  () =>
    store.getters['regions/countryList'].list?.find(region => region.id === props.item.value)
      ?.name,
)
</script>

<template>
  <span>{{ region }}</span>
</template>
