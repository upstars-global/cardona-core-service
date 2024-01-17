<script setup lang="ts">
import { ref } from 'vue';

const currentPage = ref(1)
</script>

<template>
  <VPagination
    v-model="currentPage"
    variant="outlined"
    :length="5"
  />
</template>
