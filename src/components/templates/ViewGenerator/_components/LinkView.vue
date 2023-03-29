<script setup lang="ts">
import { computed } from 'vue'
import { getters } from '../../../../store'
import { ViewInfo } from '../../../../@model/view'

const props = defineProps<{
  item: ViewInfo
}>()

const canUpdate = computed<boolean>(() =>
  props.item.permission ? getters.abilityCan(props.item.permission, 'update') : true
)
</script>

<template>
  <b-link
    v-b-modal="item.value.modalId"
    :to="item.value.route"
    :disabled="!canUpdate"
    :class="{ 'text-muted': !canUpdate }"
  >
    {{ item.value.title }}
  </b-link>
</template>

