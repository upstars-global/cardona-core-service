<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { VColors } from '../../../@model/vuetify'

interface Props {
  loading: boolean
  opacity?: number
  loader?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  opacity: 0.5,
  loader: true,
})

const overlayWrapper = ref<HTMLElement | null>(null)
const spinnerY = ref(0)

const updateSpinnerPosition = () => {
  const scrollY = window.scrollY || window.pageYOffset
  const viewportHeight = window.innerHeight

  if (!overlayWrapper.value)
    return

  const wrapperTop = overlayWrapper.value.getBoundingClientRect().top + scrollY
  const relativeY = scrollY + viewportHeight / 2 - wrapperTop

  spinnerY.value = relativeY
}

const scrollTop = ref(0)

const lockScroll = () => {
  scrollTop.value = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollTop.value}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
}

const unlockScroll = () => {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollTop.value)
}

watch(() => props.loading, async value => {
  if (value) {
    await nextTick()
    lockScroll()
    updateSpinnerPosition()
    window.addEventListener('scroll', updateSpinnerPosition)
    window.addEventListener('resize', updateSpinnerPosition)
  }
  else {
    unlockScroll()
    window.removeEventListener('scroll', updateSpinnerPosition)
    window.removeEventListener('resize', updateSpinnerPosition)
  }
})
</script>

<template>
  <div
    ref="overlayWrapper"
    class="v-overlay-wrapper"
    style="position: relative;"
  >
    <slot />

    <div
      v-if="props.loading"
      class="custom-overlay"
      :style="{ backgroundColor: `rgba(255,255,255,${props.opacity})` }"
    >
      <VProgressCircular
        v-if="props.loader"
        size="40"
        indeterminate
        :color="VColors.Primary"
        class="custom-spinner"
        :style="{ top: `${spinnerY}px` }"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
}
.custom-spinner {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
