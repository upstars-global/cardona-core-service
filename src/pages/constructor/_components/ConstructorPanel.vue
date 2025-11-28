<script setup lang="ts">
import {VVariants} from "@/@model/vuetify";

defineOptions({
  name: 'ConstructorPanel',
})

defineProps<{ icon: string }>()
</script>

<template>
  <div class="constructor-panel position-relative mt-8">
    <div class="constructor-panel__header">
      <div class="icon-wrapper border rounded-t-sm" style="width: 32px; border-bottom-style: none !important;">
        <div style="padding-left: 3px">
          <VIcon
            :icon="icon"
            :size="24"
          />
        </div>
      </div>
    </div>
    <div
      class="constructor-panel__body border rounded-b-lg"
      style="border-top-right-radius: 8px"
    >
      <VCard flat :variant="VVariants.Flat" elevation="0" class="no-border">
      <slot />
      </VCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .icon-wrapper {
    position: relative;
    &:after {
      position: absolute;
      content: '';
      background-color: white;
      width: 100%;
      height: 6px;
      bottom: -6px;
    }
  }
</style>
