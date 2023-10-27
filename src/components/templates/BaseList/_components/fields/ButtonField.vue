<script setup lang="ts">
defineProps<{
  btnName: string
}>()
</script>

<template>
  <div
    class="white-space-nowrap"
    :class="{ 'btn-table': btnName }"
  >
    {{ btnName }}
  </div>
</template>

<style lang="scss" scoped>
.btn-table {
  border: 1px solid rgb(var(--v-theme-secondary));
  max-width: max-content;
  padding: 0.25rem 0.5rem;
  border-radius: 0.35rem;
  white-space: nowrap;
}
</style>
