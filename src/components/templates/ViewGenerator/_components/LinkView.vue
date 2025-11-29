<script setup lang="ts">
import { computed, inject } from 'vue'
import type { ViewInfo } from '../../../../@model/view'
import { useUserStore } from '../../../../stores/user'
import { PermissionLevel } from '../../../../@model/permission'

const props = defineProps<{
  item: ViewInfo
}>()

const modal = inject('modal')

const userStore = useUserStore()

const canUpdate = computed<boolean>(() =>
  props.item.permission ? userStore.abilityCan(props.item.permission, PermissionLevel.update) : true,
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
    data-test-id="link"
    :class="{ 'text-muted': !canUpdate }"
  >
    {{ item.value.title }}
  </RouterLink>
  <p
    v-else
    data-test-id="title"
    class="mb-0"
    :class="{ 'text-primary cursor-pointer': canUpdate }"
    @click="openModal"
  >
    {{ item.value.title }}
  </p>
</template>
