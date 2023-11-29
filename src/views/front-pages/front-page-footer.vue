<script setup lang="ts">
import appleImg from '@images/front-pages/landing-page/apple-icon.png'
import googlePlayImg from '@images/front-pages/landing-page/google-play-icon.png'

import footerDarkBg from '@images/front-pages/backgrounds/footer-bg-dark.png'
import footerLightBg from '@images/front-pages/backgrounds/footer-bg-light.png'
import facebookDark from '@images/front-pages/icons/facebook-dark.png'
import facebookLight from '@images/front-pages/icons/facebook-light.png'
import githubDark from '@images/front-pages/icons/github-dark.png'
import githubLight from '@images/front-pages/icons/github-light.png'
import instagramDark from '@images/front-pages/icons/instagram-dark.png'
import instagramLight from '@images/front-pages/icons/instagram-light.png'
import twitterDark from '@images/front-pages/icons/twitter-dark.png'
import twitterLight from '@images/front-pages/icons/twitter-light.png'

import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

interface Menu {
  name: string
  to: any
  isNew?: boolean
}

const github = useGenerateImageVariant(githubLight, githubDark)
const twitter = useGenerateImageVariant(twitterLight, twitterDark)
const facebook = useGenerateImageVariant(facebookLight, facebookDark)
const instagram = useGenerateImageVariant(instagramLight, instagramDark)
const footerBg = useGenerateImageVariant(footerLightBg, footerDarkBg)

const pagesList: Menu[] = [
  { name: 'Pricing', to: { name: 'front-pages-pricing' } },
  { name: 'Payment', to: { name: 'front-pages-payment' }, isNew: true },
  { name: 'Checkout', to: { name: 'front-pages-checkout' } },
  { name: 'Help Center', to: { name: 'front-pages-help-center' } },
  { name: 'Login/Register', to: { name: 'pages-authentication-login-v2' } },
]

const demoList = [
  { title: 'Vertical Layout', to: 'https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-1/dashboards/analytics' },
  { title: 'Horizontal Layout', to: 'https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-5/dashboards/analytics' },
  { title: 'Bordered Layout', to: 'https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-2/dashboards/analytics' },
  { title: 'Semi Dark Layout', to: 'https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-3/dashboards/analytics' },
  { title: 'Dark Layout', to: 'https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-4/dashboards/analytics' },
]
</script>

<template>
  <div class="footer">
    <div
      class="footer-top pt-15"
      :style="{ 'background-image': `url(${footerBg})` }"
    >
      <VContainer>
        <VRow>
          <!-- 👉 Footer  -->
          <VCol
            cols="12"
            md="5"
          >
            <div
              class="mb-4"
              :class="$vuetify.display.smAndDown ? 'w-100' : 'w-75'"
            >
              <div class="d-flex align-center gap-x-3 mb-4">
                <VNodeRenderer :nodes="themeConfig.app.logo" />
                <h3 class="text-h3 text-white text-capitalize">
                  {{ themeConfig.app.title }}
                </h3>
              </div>
              <div
                class="mb-8"
                :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
              >
                Most Powerful & Comprehensive 🤩 Vuejs Admin Template with Elegant Material Design & Unique Layouts.
              </div>
              <VForm class="subscribe-form d-flex align-center">
                <AppTextField
                  label="Subscribe to newsletter"
                  placeholder="john@email.co"
                  density="compact"
                />
                <VBtn
                  class="align-self-end rounded-s-0"
                  height="40"
                >
                  Subscribe
                </VBtn>
              </VForm>
            </div>
          </VCol>

          <!-- 👉 Demos -->
          <VCol
            cols="12"
            md="2"
            sm="4"
          >
            <div>
              <div class="font-weight-medium mb-6">
                Demos
              </div>
              <ul style="list-style: none;">
                <li
                  v-for="(item, index) in demoList"
                  :key="index"
                  class="mb-4"
                >
                  <a
                    :href="item.to"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                  >
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div>
          </VCol>

          <!-- 👉 Pages  -->
          <VCol
            cols="12"
            md="2"
            sm="4"
          >
            <div>
              <div class="font-weight-medium mb-6">
                Pages
              </div>
              <ul style="list-style: none;">
                <li
                  v-for="(item, index) in pagesList"
                  :key="index"
                  class="mb-4"
                >
                  <RouterLink
                    :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant'"
                    class="me-2"
                    :to="item.to"
                  >
                    {{ item.name }}
                  </RouterLink>
                  <template v-if="item.isNew">
                    <VChip
                      color="primary"
                      variant="elevated"
                      label
                    >
                      New
                    </VChip>
                  </template>
                </li>
              </ul>
            </div>
          </VCol>

          <!-- 👉 Download App -->
          <VCol
            cols="12"
            md="3"
            sm="4"
          >
            <div>
              <div class="font-weight-medium mb-6">
                Download our app
              </div>

              <div>
                <VBtn
                  v-for="(item, index) in [
                    { image: appleImg, store: 'App Store' },
                    { image: googlePlayImg, store: 'Google Play' },
                  ]"
                  :key="index"
                  color="#282C3E"
                  size="x-large"
                  class="mb-4 d-block"
                >
                  <template #default>
                    <div class="d-flex gap-x-3">
                      <div>
                        <VImg
                          :src="item.image"
                          height="34"
                          width="34"
                        />
                      </div>
                      <div class="d-flex flex-column justify-content-start">
                        <div
                          :class="$vuetify.theme.current.dark ? 'text-body-2' : 'text-white-variant text-base'"
                          class="font-weight-normal"
                        >
                          Download on the
                        </div>
                        <div
                          class="font-weight-medium text-start"
                          :class="$vuetify.theme.current.dark ? 'text-body-1' : 'text-white-variant text-base'"
                        >
                          {{ item.store }}
                        </div>
                      </div>
                    </div>
                  </template>
                </VBtn>
              </div>
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>

    <!-- 👉 Footer Line -->
    <div class="text-white-variant footer-line w-100">
      <VContainer>
        <div class="d-flex justify-space-between flex-wrap gap-y-4 align-center">
          <span class="text-wrap me-4">
            &copy;

            {{ new Date().getFullYear() }}
            <a
              href="https://pixinvent.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="font-weight-bold ms-1 text-white"
            >Pixinvent</a>,
            Made With
            <VIcon
              icon="tabler-heart-filled"
              color="error"
              size="1.25rem"
              class="mx-1"
            />
            for a better web.
          </span>

          <div class="d-flex gap-x-6">
            <template
              v-for="(item, index) in [
                { title: 'github', icon: github, href: 'https://github.com/pixinvent' },
                { title: 'facebook', icon: facebook, href: 'https://www.facebook.com/pixinvents/' },
                { title: 'twitter', icon: twitter, href: 'https://twitter.com/pixinvents' },
                { title: 'instagram', icon: instagram, href: 'https://www.instagram.com/pixinvents/' },
              ]"
              :key="index"
            >
              <a
                :href="item.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <VAvatar
                  size="16"
                  class="rounded-0"
                >
                  <VImg
                    :src="item.icon"
                    width="16"
                  />
                </VAvatar>
              </a>
            </template>
          </div>
        </div>
      </VContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-top {
  border-radius: 60px 60px 0 0;
  background-size: cover;
  color: #fff;
}

.footer-line {
  background: #171925;
}
</style>

<style lang="scss">
.subscribe-form {
  .v-label {
    color: rgba(211, 212, 220, 50%) !important;
  }

  .v-field {
    border-radius: 6px 0 0 6px!important;

    input.v-field__input::placeholder {
      color: rgba(231, 227, 252, 50%) !important;
    }
  }

}

.footer {
  border-radius: 50%;

  @media (min-width: 600px) and (max-width: 960px) {
    .v-container {
      padding-inline: 2rem !important;
    }
  }
}
</style>
