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
      class="text-h1 font-weight-medium"
    >
      {{ props.statusCode }}
    </h1>
    <h4
      v-if="props.title"
      class="text-h4 font-weight-medium mb-3"
    >
      {{ props.title }}
    </h4>
    <p
      v-if="props.description"
      style="max-inline-size: 50vw;"
    >
      {{ props.description }}
    </p>
  </div>
</template>
