<script setup lang="ts">
definePage({ name: 'storybook' })
</script>

<template>
  <div class="storybook-wrapper">
    <iframe
      src="/storybook/index.html"
      class="storybook-frame"
      title="Component Library"
    />
  </div>
</template>

<style scoped>
.storybook-wrapper {
  height: calc(100vh - 100px);
}

.storybook-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
