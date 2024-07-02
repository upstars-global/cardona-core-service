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
  <div
    class="white-space-nowrap h-100 d-flex align-center px-4 py-3"
    @click.stop
  >
    <RouterLink
      v-if="isExistsRoute"
      :to="getUpdateRoute(item)"
      class="d-block"
    >
      {{ item.email }}
    </RouterLink>

    <p
      v-else
      class="mb-0 text-primary"
    >
      {{ item.email }}
    </p>
  </div>
</template>
