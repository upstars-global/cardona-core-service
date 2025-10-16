<script setup lang="ts">
defineOptions({
  name: 'ConstructorPanel',
})

defineProps<{ icon: string }>()
</script>

<template>
  <div class="constructor-panel">
    <div class="constructor-panel__header">
      <VIcon :icon="icon" />
    </div>
    <div class="constructor-panel__body">
      <slot />
    </div>
  </div>
</template>
  
