<script setup lang="ts">
import { ref } from 'vue';

import { VOtpInput } from 'vuetify/labs/VOtpInput'

const otp = ref('')
</script>

<template>
  <VOtpInput
    v-model="otp"
    autocomplete="on"
    type="password"
    length="5"
  />
</template>
