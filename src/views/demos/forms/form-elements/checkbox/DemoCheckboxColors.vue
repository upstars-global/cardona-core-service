<script lang="ts" setup>
import { ref } from 'vue';

const colorCheckbox = ref(['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Error'])
const selectedCheckbox = ref([])
</script>

<template>
  <div class="demo-space-x">
    <VCheckbox
      v-for="color in colorCheckbox"
      :key="color"
      v-model="selectedCheckbox"
      :label="color"
      :color="color.toLowerCase()"
      :value="color"
    />
  </div>
</template>
