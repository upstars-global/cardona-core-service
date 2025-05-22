<script setup lang="ts">
import { computed } from 'vue'
import type { ViewInfo } from '../../../../@model/view'
import store from '../../../../store'

const props = defineProps<{
  item: ViewInfo
}>()

const locale = computed(() => store.getters['localeCore/allLocalesKeys'][props.item.value])
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
