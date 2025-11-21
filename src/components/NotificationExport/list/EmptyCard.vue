<script setup lang="ts">
import NotificationExportIconFile from './IconFile.vue'

defineOptions({
  name: 'NotificationExportEmptyCard',
})
</script>

<template>
  <div class="empty-card pa-8">
    <div class="d-flex justify-center align-center mb-4">
      <NotificationExportIconFile
        :icon-size="24"
        :wrapper-size="56"
      />
    </div>
    <div class="text-center text-color-placeholder-disabled">
      {{ $t('notification.list.empty') }}
    </div>
  </div>
</template>
