<script lang="ts" setup>
import { ref } from 'vue';

const currentPage = ref(1)
</script>

<template>
  <VPagination
    v-model="currentPage"
    :length="15"
    :total-visible="$vuetify.display.mdAndUp ? 7 : 3"
  />
</template>
