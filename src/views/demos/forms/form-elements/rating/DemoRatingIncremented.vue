<script lang="ts" setup>
import { ref } from 'vue';

const rating = ref(4.5)
</script>

<template>
  <VRating
    v-model="rating"
    half-increments
    hover
  />
</template>
