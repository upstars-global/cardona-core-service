<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import type { ViewInfo } from '../../../../@model/view'
import { isEmpty } from '../../../../@core/utils/helpers'
import { useRegionsStore } from '../../../../stores/regions'

const props = defineProps<{
  item: ViewInfo
}>()

const store = useStore()
const regionsStore = useRegionsStore()

onBeforeMount(() => {
  const countryList = regionsStore.countryList?.list
  if (!countryList || isEmpty(countryList))
    regionsStore.fetchCountriesList()
})

const region = computed(() =>
  store.getters['regions/countryList']?.list?.find(
    region => region.id === props.item.value,
  )?.name || '-',
)
</script>

<template>
  <div>
    <span>
      {{ region }}
    </span>

    <slot
      name="copy-btn"
      :value="region"
    />
  </div>
</template>
