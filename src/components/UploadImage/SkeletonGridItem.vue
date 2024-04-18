<script setup lang="ts">
import { IconsList } from '../../@model/enums/icons'
</script>

<template>
  <div class="item-file item-skeleton d-flex justify-center align-center">
    <VIcon
      :icon="IconsList.ImageIcon"
      size="18"
      class="icon-no-file"
    />
  </div>
</template>
