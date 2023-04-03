<template>
  <span>{{ locale }}</span>
</template>

<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import { computed } from 'vue'
import store from '../../../../store'

const props = defineProps<{
  item: ViewInfo
}>()

const locale = computed(() => store.getters['localeCore/allLocalesKeys'][props.item.value])
</script>
