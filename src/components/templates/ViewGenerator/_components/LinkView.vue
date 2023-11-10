<script setup lang="ts">
import { computed } from 'vue'
import store from '../../../../store'
import type { ViewInfo } from '../../../../@model/view'
import { VColors } from '../../../../@model/vuetify'

const props = defineProps<{
  item: ViewInfo
}>()

const canUpdate = computed<boolean>(() =>
  props.item.permission ? store.getters.abilityCan(props.item.permission, 'update') : true,
)
</script>

<template>
  <BLink
    v-b-modal="item.value.modalId"
    :to="item.value.route"
    :disabled="!canUpdate"
    :class="[`text-${VColors.Primary}`, { 'text-muted': !canUpdate }]"
  >
    {{ item.value.title }}
  </BLink>
</template>
