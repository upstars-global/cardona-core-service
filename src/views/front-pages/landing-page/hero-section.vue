<script setup lang="ts">
import { useMouse } from '@vueuse/core'
import { useTheme } from 'vuetify'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import joinArrow from '@images/front-pages/icons/Join-community-arrow.png'
import heroDashboardImgDark from '@images/front-pages/landing-page/hero-dashboard-dark.png'
import heroDashboardImgLight from '@images/front-pages/landing-page/hero-dashboard-light.png'

import heroElementsImgDark from '@images/front-pages/landing-page/hero-elements-dark.png'
import heroElementsImgLight from '@images/front-pages/landing-page/hero-elements-light.png'

const theme = useTheme()

const heroElementsImg = useGenerateImageVariant(heroElementsImgLight, heroElementsImgDark)
const heroDashboardImg = useGenerateImageVariant(heroDashboardImgLight, heroDashboardImgDark)

const { x, y } = useMouse({ touch: false })

const translateMouse = computed(() => {
  if (typeof window !== 'undefined') {
    const rotateX = ref((window.innerHeight - (2 * y.value)) / 100)

    return { transform: `perspective(1200px) rotateX(${rotateX.value < -40 ? -20 : rotateX.value}deg) rotateY(${(window.innerWidth - (2 * x.value)) / 100}deg) scale3d(1,1,1)` }
  }
})
</script>

<template>
  <div
    id="home"
    :style="{ background: 'rgb(var(--v-theme-surface))' }"
  >
    <div id="landingHero">
      <div
        class="landing-hero"
        :class="theme.current.value.dark ? 'landing-hero-dark-bg' : 'landing-hero-light-bg'"
      >
        <VContainer>
          <div class="hero-text-box text-center px-6">
            <h1 class="text-h4 text-sm-h1 text-primary hero-title  font-weight-bold text-wrap mb-4">
              One dashboard to manage all your business
            </h1>
            <h5 class="mb-6 text-h5">
              Production-ready & easy to use Admin Template
              for Reliability and Customizability.
            </h5>
            <div class="position-relative">
              <h6 class="position-absolute hero-btn-item d-md-flex d-none text-h6">
                Join Community
                <VImg
                  :src="joinArrow"
                  class="flip-in-rtl"
                  width="60"
                  height="42"
                />
              </h6>

              <RouterLink to="#pricing-plan">
                <VBtn height="48">
                  Get early Access
                </VBtn>
              </RouterLink>
            </div>
          </div>
        </VContainer>
      </div>
    </div>

    <VContainer>
      <div class="position-relative">
        <div class="blank-section" />
        <div class="hero-animation-img position-absolute">
          <RouterLink
            :to="{ name: 'dashboards-analytics' }"
            target="_blank"
          >
            <div
              class="hero-dashboard-img position-relative"
              :style="translateMouse"
            >
              <img
                :src="heroDashboardImg"
                alt="Hero Dashboard"
                class="animation-img"
              >
              <img
                :src="heroElementsImg"
                alt="hero elements"
                class="hero-elements-img animation-img position-absolute"
                style="transform: translateZ(1rem);"
              >
            </div>
          </RouterLink>
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss" scoped>
.landing-hero {
  border-radius: 0 0 50px 50px;
  padding-block-end: 22rem;
  padding-block-start: 9rem;
}

.hero-animation-img{
  position: absolute;
  inline-size: 90%;
  inset-block-start: -25rem;
  inset-inline-start: 50%;
  margin-inline: auto;
  transform: translateX(-50%);
}

section {
  display: block;
}

.blank-section{
  background-color: rgba(var(--v-theme-surface));
  min-block-size: 25rem;
}

@media (min-width: 1280px) and (max-width: 1440px)
{
  .blank-section{
    min-block-size: 18rem;
  }

  .landing-hero{
    padding-block-end: 22rem;
  }

  .hero-animation-img{
    inset-block-start: -25rem;
  }
}

@media (min-width: 900px) and (max-width: 1279px)
{
  .blank-section{
    min-block-size: 13rem;
  }

  .landing-hero{
    padding-block-end: 14rem;
  }

  .hero-animation-img{
    inset-block-start: -17rem;
  }
}

@media (min-width: 768px) and (max-width: 899px)
{
  .blank-section{
    min-block-size: 12rem;
  }

  .landing-hero{
    padding-block-end: 12rem;
  }

  .hero-animation-img{
    inset-block-start: -15rem;
  }
}

@media (min-width: 600px) and (max-width: 767px)
{
  .blank-section{
    min-block-size: 12rem;
  }

  .landing-hero{
    padding-block-end: 8rem;
  }

  .hero-animation-img{
    inset-block-start: -11rem;
  }
}

@media (min-width: 425px) and (max-width: 600px)
{
  .blank-section{
    min-block-size: 8rem;
  }

  .landing-hero{
    padding-block-end: 8rem;
  }

  .hero-animation-img{
    inset-block-start: -9rem;
  }
}

@media (min-width: 300px) and (max-width: 424px)
{
  .blank-section{
    min-block-size: 4rem;
  }

  .landing-hero{
    padding-block-end: 6rem;
  }

  .hero-animation-img{
    inset-block-start: -7rem;
  }
}

.landing-hero::before{
  position: absolute;
  background-repeat: no-repeat;
  inset-block: 0;
  opacity: 0.5;
}

.landing-hero-dark-bg{
  background-color: #1e2130;
  background-image: url("@images/front-pages/backgrounds/hero-bg-dark.png");
  background-position: center;
  background-repeat: no-repeat;
}

.landing-hero-light-bg{
  background-image: linear-gradient(138.18deg, #eae8fd 0%, #fce5e6 94.44%);
}

@media (min-width: 600px)
{
  .hero-text-box {
    inline-size: 35rem;
    margin-block-end: 1rem;
    margin-inline: auto;
  }
}

.hero-title {
  animation: shine 2s ease-in-out infinite alternate;
  background: linear-gradient(to right, #28c76f 0%, #5a4aff 47.92%, #ff3739 100%);
  //  stylelint-disable-next-line property-no-vendor-prefix
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: rgba(0,0,0,0%);
}

@keyframes shine {
  0% {
    background-position: 0% 50%
  }

  80% {
    background-position: 50% 90%
  }

  100% {
    background-position: 91% 100%
  }
}

.hero-dashboard-img {
  margin-block: 0;
  margin-inline: auto;
  transform-style: preserve-3d;
  transition: all 0.35s;

  img{
    inline-size: 100%;
  }
}

.hero-elements-img {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
}

.feature-cards {
  margin-block-start: 6.25rem;
}

.hero-btn-item{
  inset-block-start: 80%;
  inset-inline-start: 0;
}
</style>
