import { $themeBreakpoints } from '@themeConfig'

export default {
  watch: {
    $route() {
      if (this.$store.state.breakpoint.windowWidth < $themeBreakpoints.xl) {
        this.isVerticalMenuActive = false
      }
    },
  },
}
