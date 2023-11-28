<script setup lang="ts">
interface Props {
  title: string
  divider?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  divider: true,
})
</script>

<template>
  <VDivider v-if="props.divider" />

  <div class="customizer-section">
    <div>
      <VChip
        size="x-small"
        color="primary"
      >
        <span class="text-xs font-weight-medium">{{ props.title }}</span>
      </VChip>
    </div>

    <slot />
  </div>
</template>
