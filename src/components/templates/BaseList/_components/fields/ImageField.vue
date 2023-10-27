<script setup lang="ts">
defineProps<{
  imagePath: string
}>()
</script>

<template>
  <div
    class="img-block"
    :style="`background-image: url(${imagePath});`"
  />
</template>

<style scoped>
.img-block {
  width: 6.43rem;
  height: 3.214rem;
  border-radius: 0.286rem;
  background-size: cover;
}
</style>
