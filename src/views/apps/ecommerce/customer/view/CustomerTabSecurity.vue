<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'

const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const smsVerificationNumber = ref('+1(968) 819-2547')
const isTwoFactorDialogOpen = ref(false)

// Recent devices Headers
const recentDeviceHeader = [
  { title: 'BROWSER', key: 'browser' },
  { title: 'DEVICE', key: 'device' },
  { title: 'LOCATION', key: 'location' },
  { title: 'RECENT ACTIVITY', key: 'activity' },
]

const recentDevices = [
  {
    browser: 'Chrome on Windows',
    logo: 'tabler-brand-windows',
    color: 'info',
    device: 'HP Specter 360',
    location: 'Switzerland',
    activity: '10, July 2021 20:07',
  },
  {
    browser: 'Chrome on iPhone',
    logo: 'tabler-device-mobile',
    color: 'error',
    device: 'iPhone 12x',
    location: 'Australia',
    activity: '13, July 2021 10:10',
  },
  {
    browser: 'Chrome on Android',
    logo: 'tabler-brand-android',
    color: 'success',
    device: 'OnePlus 9 Pro',
    location: 'Dubai',
    activity: '4, July 2021 15:15',
  },
  {
    browser: 'Chrome on macOS',
    logo: 'tabler-brand-apple',
    color: 'secondary',
    device: 'Apple iMac',
    location: 'India',
    activity: '20, July 2021 21:01',
  },
  {
    browser: 'Chrome on Windows',
    logo: 'tabler-brand-windows',
    color: 'info',
    device: 'HP Specter 360',
    location: 'Switzerland',
    activity: '10, July 2021 20:07',
  },
  {
    browser: 'Chrome on Android',
    logo: 'tabler-brand-android',
    color: 'success',
    device: 'OnePlus 9 Pro',
    location: 'Dubai',
    activity: '4, July 2021 15:15',
  },

]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Change password -->
      <VCard title="Change Password">
        <VCardText>
          <VAlert
            variant="tonal"
            color="warning"
            class="mb-4 px-4 py-3"
          >
            <VAlertTitle class="mb-3">
              Ensure that these requirements are met
            </VAlertTitle>
            <span>Minimum 8 characters long, uppercase & symbol</span>
          </VAlert>

          <VForm @submit.prevent="() => {}">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="New Password"
                  placeholder="············"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="Confirm Password"
                  placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <VBtn type="submit">
                  Change Password
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Two step verification -->
      <VCard>
        <VCardItem>
          <VCardTitle class="mb-2">
            Two-steps verification
          </VCardTitle>
          <VCardSubtitle>
            <span class="text-base text-medium-emphasis">Keep your account secure with authentication step.</span>
          </VCardSubtitle>
        </VCardItem>

        <VCardText>
          <div>
            <span class="text-base text-high-emphasis font-weight-medium mb-1">
              SMS
            </span>
            <VTextField
              variant="underlined"
              :model-value="smsVerificationNumber"
            >
              <template #append-inner>
                <IconBtn
                  size="small"
                  variant="text"
                >
                  <VIcon
                    icon="tabler-edit"
                    @click="isTwoFactorDialogOpen = true"
                  />
                </IconBtn>
                <IconBtn
                  size="small"
                  variant="text"
                >
                  <VIcon icon="tabler-trash" />
                </IconBtn>
              </template>
            </VTextField>
          </div>

          <p class="mb-0 mt-4">
            Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in. <a
              href="javascript:void(0)"
              class="text-decoration-none"
            >Learn more</a>.
          </p>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard title="Recent devices">
        <VDivider />
        <VDataTable
          :items="recentDevices"
          :headers="recentDeviceHeader"
          hide-default-footer
          class="text-no-wrap"
        >
          <template #item.browser="{ item }">
            <div class="d-flex align-center">
              <VIcon
                :icon="item.logo"
                :color="item.color"
                size="18"
                class="me-2"
              />
              {{ item.browser }}
            </div>
          </template>
          <!-- TODO Refactor this after vuetify provides proper solution for removing default footer -->
          <template #bottom />
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <!-- 👉 Enable One Time Password Dialog -->
  <TwoFactorAuthDialog
    v-model:isDialogVisible="isTwoFactorDialogOpen"
    :sms-code="smsVerificationNumber"
  />
</template>
