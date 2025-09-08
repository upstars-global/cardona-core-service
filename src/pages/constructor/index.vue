<script setup lang="ts">
import { VColors } from '../../@model/vuetify'

defineOptions({
  name: 'Constructor',
})
</script>

<template>
  <div>
    <VToolbar
      title="Constructor"
      :color="VColors.Primary"
    />
    <div class="pa-4">
      body
    </div>
  </div>
</template>
