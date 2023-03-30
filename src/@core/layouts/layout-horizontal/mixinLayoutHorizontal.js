import { $themeBreakpoints } from '@themeConfig'

export default {
  watch: {
    $route() {
      if (this.$store.state.breakpointCore.windowWidth < $themeBreakpoints.xl) {
        this.isVerticalMenuActive = false
      }
    },
  },
}
