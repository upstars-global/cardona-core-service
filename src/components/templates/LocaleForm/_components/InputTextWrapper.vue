<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import useResizeObserver from '../../../../use/resizeObserver'
import { VColors, VSizes, VVariants } from '../../../../@model/vuetify'

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
  canShowButton.value ? 'justify-space-between' : 'justify-end',
)

watch(elementHeight, actualElementHeight => {
  if (wasSelectedMaxHeightStyle.value)
    return
  wasSelectedMaxHeightStyle.value = actualElementHeight > props.maxHeight
  if (wasSelectedMaxHeightStyle.value)
    toggleSizeChildren()
})
</script>

<template>
  <div>
    <div
      ref="observedElement"
      class="elementToObserve"
    >
      <slot :children-style="childrenStyle" />
    </div>
    <div
      class="d-flex align-items-center pt-1"
      :class="footerClass"
    >
      <VBtn
        v-show="canShowButton"
        :variant="VVariants.Text"
        :color="VColors.Primary"
        :size="VSizes.Small"
        class="button-toggle"
        @click="toggleSizeChildren"
      >
        {{ $t(`common.${buttonToggleLabel}`) }}
      </VBtn>
      <slot
        name="footer"
        :is-show-button="canShowButton"
      />
    </div>
  </div>
</template>

<style lang="scss">
.button-toggle {
  background-color: initial;
}
</style>
