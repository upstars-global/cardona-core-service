<script setup lang="ts">
import { computed } from 'vue'
import type { ViewInfo } from '../../../../@model/view'
import { useLocaleStore } from '../../../../store/piniaModules/locale'

const props = defineProps<{
  item: ViewInfo
}>()

const localeStore = useLocaleStore()

const locale = computed(() => localeStore.allLocales[props.item.value])
</script>

<template>
  <div>
    <span>
      {{ locale }}
    </span>

    <slot
      name="copy-btn"
      :value="locale"
    />
  </div>
</template>
