<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { VSizes } from '../../../../../@model/vuetify'
import type { ColorPreviewProperty } from '../../../../../utils/colorPreview'
import { ColorPreviewState, getColorPreviewState } from '../../../../../utils/colorPreview'

const props = withDefaults(
  defineProps<{
    value?: string
    property: ColorPreviewProperty
    size?: VSizes
  }>(),
  {
    value: '',
    size: VSizes.Small,
  })

const state = computed<ColorPreviewState>(() => getColorPreviewState(props.value, props.property))

const swatchStyle = computed<CSSProperties | undefined>(() =>
  state.value === ColorPreviewState.Valid
    ? { [props.property]: props.value.trim() }
    : undefined,
)
</script>

<template>
  <div
    class="color-preview-swatch"
    :class="[`color-preview-swatch--${size}`, `color-preview-swatch--${state}`]"
    :style="swatchStyle"
    :data-state="state"
    data-test-id="color-preview-swatch"
  />
</template>

<style lang="scss" scoped>
$diagonal-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='0 0 100 100'%3E%3Cpath d='M0 0L100 100' stroke='%23000' stroke-width='1' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E");

.color-preview-swatch {
  position: relative;
  box-sizing: border-box;
  flex: 0 0 auto;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-grey-200));
  background-repeat: repeat;

  &--small {
    inline-size: 1.25rem;
    block-size: 1rem;

    &.color-preview-swatch--empty {
      background-image: conic-gradient(
        transparent 0deg 90deg,
        rgb(var(--v-theme-grey-200)) 90deg 180deg,
        transparent 180deg 270deg,
        rgb(var(--v-theme-grey-200)) 270deg 360deg
      );
    }
  }

  &--large {
    inline-size: 7rem;
    block-size: 7rem;
    border-radius: 4px;
    align-self: flex-start;

    &.color-preview-swatch--empty {
      background-image: repeating-conic-gradient(
        rgb(var(--v-theme-grey-200)) 0% 25%,
        transparent 0% 50%
      );
      background-size: 8px 8px;
    }
  }

  &--invalid::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgb(var(--v-theme-error));
    -webkit-mask-image: $diagonal-mask;
    mask-image: $diagonal-mask;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
  }
}
</style>
