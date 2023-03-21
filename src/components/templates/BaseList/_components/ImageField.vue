<template>
  <div class="img-block" :style="`background-image: url(${imagePath});`" />
</template>

<script setup lang="ts">
const props = defineProps<{
  imagePath: string
}>()
</script>

<style scoped>
.img-block {
  width: 6.43rem;
  height: 3.214rem;
  border-radius: 0.286rem;
  background-size: cover;
}
</style>