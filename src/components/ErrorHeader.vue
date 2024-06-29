<script setup lang="ts">
interface Props {
  statusCode?: string | number
  title?: string
  description?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="text-center">
    <!-- 👉 Title and subtitle -->
    <h1
      v-if="props.statusCode"
      class="text-h1 font-weight-medium status-code"
    >
      {{ props.statusCode }}
    </h1>
    <h4
      v-if="props.title"
      class="text-h4 font-weight-medium mb-3 title"
    >
      {{ props.title }}
    </h4>
    <p
      class="description"
      v-if="props.description"
    >
      {{ props.description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .status-code {
    font-size: clamp(3rem,5vw,6rem) !important;
    line-height: clamp(3rem,5vw,6rem) !important;
    padding-bottom: 0.5rem;
  }

  .title {
    font-size: 1.5rem !important;
    line-height: 1.375rem !important;
  }

  .description {
    max-inline-size: 50vw;
    font-size: 1rem;
  }
</style>
