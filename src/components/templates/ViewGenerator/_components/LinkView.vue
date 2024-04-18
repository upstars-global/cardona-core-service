<script setup lang="ts">
import { computed, inject } from 'vue'
import store from '../../../../store'
import type { ViewInfo } from '../../../../@model/view'

const props = defineProps<{
  item: ViewInfo
}>()

const modal = inject('modal')

const canUpdate = computed<boolean>(() =>
  props.item.permission ? store.getters.abilityCan(props.item.permission, 'update') : true,
)

const isLink = computed<boolean>(() => props.item.value.route)

const openModal = () => {
  if (!canUpdate.value)
    return

  modal.showModal(props.item.value.modalId)
}
</script>

<template>
  <RouterLink
    v-if="isLink"
    :to="item.value.route"
    :disabled="!canUpdate"
    class="text-primary"
    :class="{ 'text-muted': !canUpdate }"
  >
    {{ item.value.title }}
  </RouterLink>
  <p
    v-else
    class="text-primary mb-0 cursor-pointer"
    :class="{ 'text-muted': !canUpdate }"
    @click="openModal"
  >
    {{ item.value.title }}
  </p>
</template>
