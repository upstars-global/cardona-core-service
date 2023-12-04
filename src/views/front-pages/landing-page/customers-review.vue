<script setup lang="ts">
import { register } from 'swiper/element/bundle'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import logo1dark from '@images/front-pages/branding/logo-1-dark.png'
import logo1light from '@images/front-pages/branding/logo-1-light.png'
import logo1 from '@images/front-pages/branding/logo-1.png'
import logo2dark from '@images/front-pages/branding/logo-2-dark.png'
import logo2light from '@images/front-pages/branding/logo-2-light.png'
import logo2 from '@images/front-pages/branding/logo-2.png'
import logo3dark from '@images/front-pages/branding/logo-3-dark.png'
import logo3light from '@images/front-pages/branding/logo-3-light.png'
import logo3 from '@images/front-pages/branding/logo-3.png'
import logo4dark from '@images/front-pages/branding/logo-4-dark.png'
import logo4light from '@images/front-pages/branding/logo-4-light.png'
import logo4 from '@images/front-pages/branding/logo-4.png'
import logo5dark from '@images/front-pages/branding/logo-5-dark.png'
import logo5light from '@images/front-pages/branding/logo-5-light.png'

import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'

register()

const brandLogo1 = useGenerateImageVariant(logo1light, logo1dark)
const brandLogo2 = useGenerateImageVariant(logo2light, logo2dark)
const brandLogo3 = useGenerateImageVariant(logo3light, logo3dark)
const brandLogo4 = useGenerateImageVariant(logo4light, logo4dark)
const brandLogo5 = useGenerateImageVariant(logo5light, logo5dark)

// Customer Review Data
const reviewData = [
  {
    desc: 'I\'ve never used a theme as versatile and flexible as Vuexy. It\'s my go to for building dashboard sites on almost any project.',
    img: logo1,
    rating: 5,
    name: 'Eugenia Moore',
    position: 'Founder of Hubspot',
    avatar: avatar1,
  },
  {
    desc: 'This template is really clean & well documented. The docs are really easy to understand and it\'s always easy to find a screenshot from their website.',
    img: logo2,
    rating: 5,
    name: 'Curtis Fletcher',
    position: 'Design Lead at Dribbble',
    avatar: avatar2,
  },
  {
    desc: 'This template is superior in so many ways. The code, the design, the regular updates, the support.. It\'s the whole package. Excellent Work.',
    img: logo3,
    rating: 4,
    name: 'Eugenia Moore',
    position: 'CTO of Airbnb',
    avatar: avatar3,
  },
  {
    desc: 'All the requirements for developers have been taken into consideration, so I\'m able to build any interface I want.',
    img: logo4,
    rating: 5,
    name: 'Sara Smith',
    position: 'Founder of Continental',
    avatar: avatar4,
  },
  {
    desc: 'Materio is awesome, and I particularly enjoy knowing that if I get stuck on something.',
    img: logo3,
    rating: 5,
    name: 'Tommy haffman',
    position: 'Founder of Levis',
    avatar: avatar5,
  },
  {
    desc: 'I\'ve never used a theme as versatile and flexible as Vuexy. It\'s my go to for building dashboard sites on almost any project.',
    img: logo1,
    rating: 5,
    name: 'Eugenia Moore',
    position: 'Founder of Hubspot',
    avatar: avatar1,
  },
  {
    desc: 'Materio is awesome, and I particularly enjoy knowing that if I get stuck on something.',
    img: logo2,
    rating: 5,
    name: 'Tommy haffman',
    position: 'Founder of Levis',
    avatar: avatar2,
  },
  {
    desc: 'This template is superior in so many ways. The code, the design, the regular updates, the support.. It\'s the whole package. Excellent Work.',
    img: logo3,
    rating: 4,
    name: 'Eugenia Moore',
    position: 'CTO of Airbnb',
    avatar: avatar3,
  },
  {
    desc: 'All the requirements for developers have been taken into consideration, so I\'m able to build any interface I want.',
    img: logo4,
    rating: 4,
    name: 'Sara Smith',
    position: 'Founder of Continental',
    avatar: avatar4,
  },
  {
    desc: 'This template is really clean & well documented. The docs are really easy to understand and it\'s always easy to find a screenshot from their website.',
    img: logo2,
    rating: 5,
    name: 'Curtis Fletcher',
    position: 'Design Lead at Dribbble',
    avatar: avatar5,
  },
]

const customerReviewSwiper = ref(null)

const slide = (dir: string) => {
  const swiper = customerReviewSwiper.value?.swiper

  if (dir === 'prev')
    swiper.slidePrev()

  swiper.slideNext()
}
</script>

<template>
  <div
    id="customer-review"
    class="position-relative"
  >
    <VContainer>
      <div class="customer-reviews">
        <!-- 👉 Headers  -->
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <div
              class="headers d-flex justify-center flex-column align-start h-100"
              style="max-inline-size: 275px;"
            >
              <VChip
                label
                color="primary"
                class="mb-4"
              >
                REAL CUSTOMERS REVIEWS
              </VChip>
              <div class="text-h3">
                <div class="position-relative me-2">
                  <h3 class="section-title mb-1">
                    What people say
                  </h3>
                </div>
              </div>
              <p class="mb-12">
                See what our customers have to say about their experience.
              </p>
              <div class="position-relative">
                <IconBtn
                  class="reviews-button-prev rounded me-4"
                  variant="tonal"
                  color="primary"
                  @click="slide('prev')"
                >
                  <VIcon icon="tabler-chevron-left" />
                </IconBtn>

                <IconBtn
                  class="reviews-button-next rounded"
                  variant="tonal"
                  color="primary"
                  @click="slide('next')"
                >
                  <VIcon icon="tabler-chevron-right" />
                </IconBtn>
              </div>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="8"
          >
            <!-- 👉 Customer Review Swiper -->
            <div class="swiper-reviews-carousel py-4">
              <!-- eslint-disable vue/attribute-hyphenation -->
              <swiper-container
                ref="customerReviewSwiper"
                slides-per-view="1"
                space-between="5"
                loop="true"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                events-prefix="swiper-"
                :injectStyles="[
                  `
                    .swiper{
                      padding: 0;
                    }
                    .swiper-button-next, .swiper-button-prev{
                      visibility: hidden;
                    }
                  `,
                ]"
                navigation="{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }"
                :breakpoints="{
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  960: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                }"
              >
                <swiper-slide
                  v-for="(data, index) in reviewData"
                  :key="index"
                >
                  <VCard class="d-flex h-100 align-stretch">
                    <VCardText class="pa-6 d-flex flex-column justify-space-between align-start">
                      <img
                        :src="data.img"
                        style="block-size: 1.375rem;"
                        class="mb-3"
                      >
                      <p class="text-body-1 text-high-emphasis">
                        {{ data.desc }}
                      </p>

                      <VRating
                        :model-value="data.rating"
                        color="warning"
                        density="compact"
                        class="mb-3"
                        readonly
                      />
                      <div class="d-flex align-center gap-x-3">
                        <VAvatar
                          :image="data.avatar"
                          size="32"
                        />
                        <div>
                          <div class="text-body-1 text-high-emphasis font-weight-medium">
                            {{ data.name }}
                          </div>

                          <div class="text-body-2 text-disabled">
                            {{ data.position }}
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </swiper-slide>
              </swiper-container>
            </div>
          </VCol>
        </VRow>
      </div>

      <!-- 👉 Brand-logo Swiper  -->
      <div class="swiper-brands-carousel mb-4 mt-8">
        <swiper-container
          slides-per-view="2"
          events-prefix="swiper-"
          :autoplay="{
            delay: 3000,
            disableOnInteraction: true,
          }"
          :breakpoints="{
            992: {
              slidesPerView: 5,
            },
            768: {
              slidesPerView: 3,
            },
          }"
        >
          <swiper-slide
            v-for="(img, index) in [brandLogo1, brandLogo2, brandLogo3, brandLogo4, brandLogo5]"
            :key="index"
          >
            <VImg
              :src="img"
              height="38"
            />
          </swiper-slide>
        </swiper-container>
      </div>
    </VContainer>

    <VDivider class="w-100 position-absolute swiper-divider" />
  </div>
</template>

<style lang="scss">
@use "swiper/css/bundle";

swiper-container::part(bullet-active) {
  border-radius: 6px;
  background-color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
  inline-size: 38px;
}

swiper-container::part(bullet) {
  background-color: rgba(var(--v-theme-on-background));
}

.swiper-reviews-carousel {
  swiper-container {
    .swiper {
      padding-block-end: 3rem;
    }

    .swiper-button-next{
      display: none;
    }
  }

  swiper-slide {
    block-size: auto;
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.swiper-divider{
  position: absolute;
  inset-block-end: 6rem;
}

.customer-reviews {
  margin-block: 5rem;
}

@media (max-width: 600px){
  .customer-reviews{
    margin-block: 4rem;
  }
}

#customer-review{
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgb(var(--v-theme-background));
}

.section-title::after{
  position: absolute;
  background: url('../../../assets/images/front-pages/icons/section-title-icon.png') no-repeat left bottom/contain;
  background-size: contain;
  block-size: 100%;
  content: '';
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}
</style>
