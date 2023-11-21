<template>
  <div>
    <div ref="observedElement" class="elementToObserve">
      <slot :children-style="childrenStyle"></slot>
    </div>
    <div class="d-flex align-items-center" :class="footerClass">
      <VButton
        v-show="canShowButton"
        :variant="VVariants.Flat"
        :color="VColors.Primary"
        size="sm"
        class="button-toggle"
        style="background-color: initial"
        @click="toggleSizeChildren"
        >{{ $t(`common.${buttonToggleLabel}`) }}</VButton>
      <slot name="footer" :is-show-button="canShowButton" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import useResizeObserver from '../../../../use/resizeObserver'
import { VColors, VVariants } from "../../../../@model/vuetify";

interface Props {
  maxHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxHeight: 500,
})

const { observedElement, elementHeight } = useResizeObserver()

const isMoreThanMaxHeight = computed(() => elementHeight.value?.toFixed(0) > props.maxHeight)

const showFullContent = ref(true)

const wasSelectedMaxHeightStyle = ref(false)

const childrenStyle = computed(() => {
  return {
    'max-height': showFullContent.value ? 'none' : `${props.maxHeight}px`,
  }
})

const buttonToggleLabel = computed(() => (showFullContent.value ? 'showLess' : 'showMore'))

const toggleSizeChildren = () => {
  showFullContent.value = !showFullContent.value
}

const canShowButton = computed(() => wasSelectedMaxHeightStyle.value || isMoreThanMaxHeight.value)
const footerClass = computed(() =>
  canShowButton.value ? 'justify-content-between' : 'justify-content-end'
)

watch(elementHeight, (actualElementHeight) => {
  if (wasSelectedMaxHeightStyle.value) return
  wasSelectedMaxHeightStyle.value = actualElementHeight > props.maxHeight
  if (wasSelectedMaxHeightStyle.value) toggleSizeChildren()
})
</script>

<style>
.button-toggle {
  padding: 0;
  background-color: initial;
}
</style>
