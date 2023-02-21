<template>
  <div class="white-space-nowrap">
    <router-link :to="getUpdateRoute(item)" class="d-block">
      {{ item.email }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EmailField',

  props: {
    item: {
      type: Object,
      required: true,
    },

    getUpdateRoute: {
      type: Function,
      default: () => ({}),
    },
  },
})
</script>
