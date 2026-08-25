<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll, useScroll } from '@vueuse/core'

const props = withDefaults(defineProps<{
  scrollEl?: HTMLElement | null
}>(), { scrollEl: null })

const { y: windowY } = useWindowScroll()
const { y: elY } = useScroll(() => props.scrollEl)

const y = computed(() => props.scrollEl ? elY.value : windowY.value)

const scrollToTop = () => {
  if (props.scrollEl)
    props.scrollEl.scrollTo({ top: 0, behavior: 'smooth' })
  else
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <VScaleTransition
    style="transform-origin: center;"
    class="scroll-to-top d-print-none"
  >
    <VBtn
      v-show="y > 200"
      icon
      density="comfortable"
      @click="scrollToTop"
    >
      <VIcon
        size="22"
        icon="tabler-arrow-up"
      />
    </VBtn>
  </VScaleTransition>
</template>

<style lang="scss">
.scroll-to-top {
  position: fixed !important;

  // To keep button on top of v-layout. E.g. Email app
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 25px;
  bottom: 0.5rem;
}
</style>
