<template>
  <div class="circle-status" :class="statusClass" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'PillStatusField',

  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const statusClass = computed(() => (props.isActive ? 'active' : 'inactive'))

    return {
      statusClass,
    }
  },
})
</script>
