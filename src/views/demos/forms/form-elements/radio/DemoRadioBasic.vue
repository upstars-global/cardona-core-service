<script lang="ts" setup>
import { ref } from 'vue';

const radioGroup = ref(1)
</script>

<template>
  <div class="">
    <VRadioGroup v-model="radioGroup">
      <VRadio
        v-for="n in 2"
        :key="n"
        :label="`Radio ${n}`"
        :value="n"
      />
    </VRadioGroup>
  </div>
</template>
