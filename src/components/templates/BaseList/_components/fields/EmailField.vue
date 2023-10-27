<script setup lang="ts">
defineProps<{
  item: Record<string, any>
  getUpdateRoute?: () => Record<string, any>
}>()
</script>

<template>
  <div class="white-space-nowrap">
    <RouterLink
      :to="getUpdateRoute(item)"
      class="d-block"
    >
      {{ item.email }}
    </RouterLink>
  </div>
</template>
