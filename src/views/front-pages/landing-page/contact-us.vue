<script setup lang="ts">
import ConnectImg from '@images/front-pages/landing-page/contact-customer-service.png'

const name = ref('')
const email = ref('')
const message = ref('')
</script>

<template>
  <VContainer id="contact-us">
    <!-- 👉 Headers  -->
    <div class="contact-us-section">
      <div class="headers d-flex justify-center flex-column align-center py-12">
        <VChip
          label
          color="primary"
          class="mb-4"
        >
          Contact US
        </VChip>
        <div class="d-flex align-center text-h3 mb-1 flex-wrap justify-center">
          <div class="position-relative me-2">
            <h3 class="section-title">
              let's work
            </h3>
          </div>
          together
        </div>
        <p>
          Any question or remark? just write us a message
        </p>
      </div>

      <div class="mb-15">
        <VRow class="match-height">
          <VCol
            cols="12"
            md="4"
          >
            <div class="contact-card h-100">
              <VCard
                variant="outlined"
                border
                class="pa-2"
                :style="{ borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem' }"
              >
                <VImg
                  :src="ConnectImg"
                  :style="{ borderRadius: '3.75rem 0.375rem 0.375rem 0.375rem' }"
                />
                <VCardText>
                  <div class="d-flex justify-space-between flex-wrap gap-y-4">
                    <div
                      v-for="(item, index) in [
                        { title: 'Email', icon: 'tabler-mail', color: 'primary', value: 'example@gmail.com' },
                        { title: 'Phone', icon: 'tabler-phone-call', color: 'success', value: '+1234 568 963' },
                      ]"
                      :key="index"
                      class="d-flex gap-x-3 align-center"
                    >
                      <div>
                        <VAvatar
                          size="36"
                          :color="item.color"
                          variant="tonal"
                          class="rounded-sm"
                        >
                          <VIcon
                            :icon="item.icon"
                            size="24"
                          />
                        </VAvatar>
                      </div>

                      <div>
                        <div>{{ item .title }}</div>
                        <div class="font-weight-medium text-high-emphasis">
                          {{ item.value }}
                        </div>
                      </div>
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </div>
          </VCol>

          <VCol
            cols="12"
            md="8"
          >
            <VCard flat>
              <VCardItem class="pb-0">
                <VCardTitle class="text-h4 mb-1">
                  Send a message
                </VCardTitle>
              </VCardItem>

              <VCardText>
                <p class="mb-6">
                  If you would like to discuss anything related to payment, account, licensing, partnerships, or have pre-sales questions, you’re at the right place.
                </p>
                <VForm @submit.prevent="() => {}">
                  <VRow>
                    <VCol
                      cols="12"
                      md="6"
                    >
                      <AppTextField
                        v-model="name"
                        placeholder="John Doe"
                        label="Full Name"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="6"
                    >
                      <AppTextField
                        v-model="email"
                        placeholder="johndoe@gmail.com"
                        label="Email address"
                      />
                    </VCol>

                    <VCol cols="12">
                      <AppTextarea
                        v-model="message"
                        placeholder="Write a message"
                        label="Message"
                      />
                    </VCol>

                    <VCol>
                      <VBtn type="submit">
                        Send Inquiry
                      </VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </div>
    </div>
  </VContainer>
</template>

<style lang="scss" scoped>
.contact-us-section {
  margin-block: 5.25rem;
}

.section-title::after {
  position: absolute;
  background: url('../../../assets/images/front-pages/icons/section-title-icon.png') no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: '';
  font-weight: 700;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: 0%;
}

.contact-card{
  position: relative
}

.contact-card::before{
  position: absolute;
  content: url('@images/front-pages/icons/contact-border.png');
  inset-block-start: -2.5rem;
  inset-inline-start: -2.5rem;
}

@media screen and (max-width: 999px) {
  .contact-card::before{
    display: none;
  }
}
</style>
