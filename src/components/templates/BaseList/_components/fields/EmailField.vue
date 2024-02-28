<script setup lang="ts">
import { computed } from 'vue'
import type { _RouteLocationBase } from 'vue-router'

const props = defineProps<{
  item: Record<string, any>
  getUpdateRoute?: (item: Record<string, any>) => Location
}>()

const isExistsRoute = computed(() => {
  const { name }: _RouteLocationBase = props.getUpdateRoute(props.item)

  return !!name
})
</script>

<template>
  <div class="white-space-nowrap">
    <RouterLink
      v-if="isExistsRoute"
      :to="getUpdateRoute(item)"
      class="d-block"
    >
      {{ item.email }}
    </RouterLink>
  </div>
</template>
