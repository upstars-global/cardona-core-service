<script setup lang="ts">
defineProps<{
  data?: Record<string, string>
}>()
</script>

<template>
  <div class="table-block">
    <div
      v-for="(value, name) in data"
      :key="name"
      class="d-flex align-items-start"
    >
      {{ `${name}: ${value}` }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-block {
  width: max-content;
  padding: 0.5rem 0;
}
</style>
