<script setup lang="ts">
import * as demoCode from '@/views/demos/components/swiper/demoCodeSwiper'
</script>

<template>
  <VRow>
    <VCol>
      <AppCardCode
        title="Basic"
        :code="demoCode.basic"
      >
        <DemoSwiperBasic />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Navigation"
        :code="demoCode.navigation"
      >
        <DemoSwiperNavigation />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Pagination"
        :code="demoCode.pagination"
      >
        <DemoSwiperPagination />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Progress"
        :code="demoCode.progress"
      >
        <DemoSwiperProgress />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Multiple Slides Per View"
        :code="demoCode.multipleSlidesPerView"
      >
        <DemoSwiperMultipleSlidesPerView />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Grid"
        :code="demoCode.grid"
      >
        <DemoSwiperGrid />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        variant="text"
        title="Centered Slides Option 1"
        :code="demoCode.centeredSlidesOption1"
      >
        <DemoSwiperCenteredSlidesOption1 />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Centered Slides Option 2"
        :code="demoCode.centeredSlidesOption2"
      >
        <DemoSwiperCenteredSlidesOption2 />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Fade"
        :code="demoCode.fade"
      >
        <DemoSwiperFade />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Cube Effect"
        :code="demoCode.cubeEffect"
      >
        <DemoSwiperCubeEffect />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Coverflow Effect"
        :code="demoCode.coverflowEffect"
      >
        <DemoSwiperCoverflowEffect />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Autoplay"
        :code="demoCode.autoplay"
      >
        <DemoSwiperAutoplay />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Gallery"
        :code="demoCode.gallery"
      >
        <DemoSwiperGallery />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Lazy Loading"
        :code="demoCode.lazyLoading"
      >
        <DemoSwiperLazyLoading />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Responsive Breakpoints"
        :code="demoCode.responsiveBreakpoints"
      >
        <DemoSwiperResponsiveBreakpoints />
      </AppCardCode>
    </VCol>

    <VCol>
      <AppCardCode
        title="Virtual Slides"
        :code="demoCode.virtualSlides"
      >
        <DemoSwiperVirtualSlides />
      </AppCardCode>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/swiper.scss"
</style>
