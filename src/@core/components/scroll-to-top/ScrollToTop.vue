<template>
  <div class="btn-scroll-to-top" :class="{ show: y > 250 }">
    <!-- We have wrapper because ripple effect give position relative to this absolute positioned btn -->
    <!-- Hence due to that our btn get lost -->
    <b-button variant="primary" class="btn-icon" @click="scrollToTop">
      <feather-icon :icon="IconsList.ArrowUpIcon" size="16" />
    </b-button>
  </div>
</template>

<script>
import { useWindowScroll } from '@vueuse/core'
import { BButton } from 'bootstrap-vue'
import { IconsList } from '../../../@model/enums/icons'

export default {
  components: {
    BButton,
  },
  setup() {
    const { y } = useWindowScroll()

    const scrollToTop = () => {
      const rootEle = document.documentElement
      rootEle.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    return { y, scrollToTop, IconsList }
  },
}
</script>

<style lang="scss" scoped>
.btn-scroll-to-top {
  position: fixed;
  bottom: 5%;
  right: 30px;
  z-index: 99;

  opacity: 0;
  // transform: translateY(100px);
  transition: all 0.5s ease;

  &.show {
    opacity: 1;
    // transform: translateY(0)
  }
}
</style>
