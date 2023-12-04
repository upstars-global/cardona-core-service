<script setup lang="ts">
import Footer from '@/views/front-pages/front-page-footer.vue'
import Navbar from '@/views/front-pages/front-page-navbar.vue'
import laptopGirl from '@images/illustrations/laptop-girl.png'

definePage({
  meta: {
    layout: 'blank',
  },
})

const features = [
  {
    feature: '14-days free trial',
    starter: true,
    pro: true,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: false,
      enterprise: false,
    },
  },
  {
    feature: 'No user limit',
    starter: false,
    pro: false,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: false,
      enterprise: false,
    },
  },
  {
    feature: 'Product Support',
    starter: false,
    pro: true,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: false,
      enterprise: false,
    },
  },
  {
    feature: 'Email Support',
    starter: false,
    pro: false,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: true,
      enterprise: false,
    },
  },
  {
    feature: 'Integrations',
    starter: false,
    pro: true,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: false,
      enterprise: false,
    },
  },
  {
    feature: 'Removal of Front branding',
    starter: false,
    pro: false,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: true,
      enterprise: false,
    },
  },
  {
    feature: 'Active maintenance & support',
    starter: false,
    pro: false,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: false,
      enterprise: false,
    },
  },
  {
    feature: 'Data storage for 365 days',
    starter: false,
    pro: false,
    enterprise: true,
    addOnAvailable: {
      starter: false,
      pro: false,
      enterprise: false,
    },
  },
]

const faqs = [
  {
    question: 'How do you process payments?',
    answer: 'We accept Visa®, MasterCard®, American Express®, and PayPal®. So you can be confident that your credit card information will be kept safe and secure.',
  },
  {
    question: 'What counts towards the 100 responses limit?',
    answer: 'We count all responses submitted through all forms in a month.If you already received 100 responses this month, you won\'t be able to receive any more of them until next month when the counter resets.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'Checkout accepts all type of credit and debit cards.',
  },
]

const activeFaqIndex = ref(1)
</script>

<template>
  <div class="pricing-page">
    <Navbar />

    <VCard class="pricing-card">
      <VCardText class="pt-12 pb-16">
        <!-- 👉 App Pricing components -->
        <VContainer>
          <AppPricing md="4" />
        </VContainer>
      </VCardText>

      <!-- 👉 Free trial Banner -->

      <div class="page-pricing-free-trial-banner-bg">
        <VContainer>
          <div class="d-flex align-center flex-md-row flex-column position-relative">
            <div class="text-center text-md-start py-4 px-10 px-sm-0">
              <h3 class="text-h3 text-primary mb-2">
                Still not convinced? Start with a 14-day FREE trial!
              </h3>
              <p>
                You will get full access to all the features for 14 days.
              </p>
              <VBtn
                class="mt-4"
                :to="{ name: 'front-pages-payment' }"
              >
                Start-14-day FREE trial
              </VBtn>
            </div>
            <div class="free-trial-illustrator">
              <VImg
                :src="laptopGirl"
                :width="202"
              />
            </div>
          </div>
        </VContainer>
      </div>

      <!-- 👉 Plans -->
      <VCardText class="text-center mt-14 pb-16">
        <h2 class="text-h2 mb-2">
          Pick a plan that works best for you
        </h2>
        <p class="text-disabled mb-6">
          Stay cool, we have a 48-hour money back guarantee!
        </p>

        <!-- 👉 Features & Tables -->

        <VContainer>
          <VTable
            class="text-no-wrap border rounded pricing-table"
            density="comfortable"
          >
            <!-- 👉 Table head -->
            <thead>
              <tr>
                <th
                  scope="col"
                  class="py-4"
                >
                  <div class="mb-1">
                    Features
                  </div>
                  <div class="text-disabled text-capitalize font-weight-regular">
                    Native Font Features
                  </div>
                </th>

                <th
                  v-for="{ plan, price } in [
                    { plan: 'Starter', price: 'Free' },
                    { plan: 'Pro', price: '$7.5/Month' },
                    { plan: 'Enterprise', price: '$16/Month' },
                  ]"
                  :key="plan"
                  scope="col"
                  class="text-center py-4"
                >
                  <div class="mb-1 position-relative">
                    {{ plan }}

                    <VAvatar
                      v-if="plan === 'Pro'"
                      size="24"
                      class="ms-2 position-absolute"
                      variant="elevated"
                      color="primary"
                      style="inset-block-end: 3px"
                    >
                      <VIcon
                        icon="tabler-star"
                        size="16"
                        color="white"
                      />
                    </VAvatar>
                  </div>
                  <div class="text-disabled text-capitalize font-weight-regular">
                    {{ price }}
                  </div>
                </th>
              </tr>
            </thead>
            <!-- 👉 Table Body -->
            <tbody>
              <tr
                v-for="feature in features"
                :key="feature.feature"
              >
                <td class="text-start">
                  {{ feature.feature }}
                </td>
                <td class="text-center">
                  <VAvatar
                    variant="tonal"
                    size="20"
                    :color="feature.starter ? 'primary' : 'disabled'"
                  >
                    <VIcon
                      v-if="!feature.addOnAvailable.starter"
                      :color="feature.starter ? 'primary' : 'disabled'"
                      size="14"
                      :icon="feature.starter ? 'tabler-check' : 'tabler-x'"
                    />
                  </VAvatar>

                  <VChip
                    v-if="feature.addOnAvailable.starter"
                    color="primary"
                    size="small"
                    label
                  >
                    ADD-ON AVAILABLE
                  </VChip>
                </td>

                <td class="text-center">
                  <VChip
                    v-if="feature.addOnAvailable.pro"
                    color="primary"
                    size="small"
                    label
                  >
                    ADD-ON AVAILABLE
                  </VChip>

                  <VAvatar
                    v-else
                    size="20"
                    variant="tonal"
                    :color="feature.pro ? 'primary' : 'disabled'"
                  >
                    <VIcon
                      :color="feature.pro ? 'primary' : 'disabled'"
                      size="14"
                      :icon="feature.pro ? 'tabler-check' : 'tabler-x'"
                    />
                  </VAvatar>
                </td>

                <td class="text-center">
                  <VChip
                    v-if="feature.addOnAvailable.enterprise"
                    label
                    color="primary"
                    size="small"
                  >
                    ADD-ON AVAILABLE
                  </VChip>

                  <VAvatar
                    v-else
                    size="20"
                    variant="tonal"
                    :color="feature.enterprise ? 'primary' : 'disabled'"
                  >
                    <VIcon
                      :color="feature.enterprise ? 'primary' : 'disabled'"
                      size="14"
                      :icon="feature.enterprise ? 'tabler-check' : 'tabler-x'"
                    />
                  </VAvatar>
                </td>
              </tr>
            </tbody>
            <!-- 👉 Table footer -->
            <tfoot>
              <tr>
                <td class="py-4" />
                <td class="text-center py-4">
                  <VBtn
                    variant="tonal"
                    :to="{ name: 'front-pages-payment' }"
                  >
                    Choose Plan
                  </VBtn>
                </td>

                <td class="text-center py-4">
                  <VBtn :to="{ name: 'front-pages-payment' }">
                    Choose Plan
                  </VBtn>
                </td>

                <td class="text-center py-4">
                  <VBtn
                    variant="tonal"
                    :to="{ name: 'front-pages-payment' }"
                  >
                    Choose Plan
                  </VBtn>
                </td>
              </tr>
            </tfoot>
          </VTable>
        </VContainer>
      </VCardText>

      <!-- 👉 FAQ -->
      <div style="background-color: rgba(var(--v-theme-on-surface),var(--v-hover-opacity));">
        <VContainer>
          <VCardText class="py-10 px-0 py-sm-16">
            <div class="text-center">
              <h2 class="text-h2 mb-2">
                FAQ's
              </h2>
              <p>
                Let us help answer the most common questions.
              </p>
            </div>
            <div class="py-sm-6">
              <VExpansionPanels v-model="activeFaqIndex">
                <VExpansionPanel
                  v-for="(faq, index) in faqs"
                  :key="faq.question"
                  :title="faq.question"
                  :text="faq.answer"
                  :value="index"
                  collapse-icon=""
                  expand-icon=""
                />
              </VExpansionPanels>
            </div>
          </VCardText>
        </VContainer>
      </div>

      <div style="background-color:rgba(var(--v-theme-on-surface),var(--v-hover-opacity));">
        <Footer />
      </div>
    </VCard>
  </div>
</template>

<style lang="scss">
.page-pricing-free-trial-banner-bg {
  /* stylelint-disable-next-line color-function-notation */
  background-color: rgba(var(--v-theme-primary), var(--v-idle-opacity));
}

.pricing-card {
  padding-block-start: 6.25rem !important;
}

@media screen and (min-width: 960px) {
  .free-trial-illustrator {
    position: absolute;
    inset-block-end: -1rem !important;
    inset-inline-end: 0%;
  }
}

@media screen and (max-width: 959px) {
  .free-trial-illustrator {
    position: relative;
    inset-block-end: -1rem !important;
  }
}

.pricing-table{
  tr:nth-child(even){
    background: rgba(var(--v-theme-on-surface), 2%)
  }
}
</style>
