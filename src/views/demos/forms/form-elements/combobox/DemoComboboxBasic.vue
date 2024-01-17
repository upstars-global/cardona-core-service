<script lang="ts" setup>
import { ref } from 'vue';

const selectedItem = ref('Programming')
const items = ['Programming', 'Design', 'Vue', 'Vuetify']
</script>

<template>
  <AppCombobox
    v-model="selectedItem"
    :items="items"
    placeholder="deployment"
  />
</template>
