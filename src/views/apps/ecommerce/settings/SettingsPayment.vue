<script setup lang="ts">
import { ref } from 'vue'
import paypal from '@images/cards/paypal-primary.png'

const isAddPaymentMethodsDialogVisible = ref(false)
const isPaymentProvidersDialogVisible = ref(false)
</script>

<template>
  <div>
    <!-- 👉 Payment Providers  -->
    <VCard
      class="mb-6"
      title="Payment providers"
    >
      <VCardText>
        <div class="text-sm mb-4">
          Providers that enable you to accept payment methods at a rate set by the third-party. An additional fee will apply to new orders once you select a plan.
        </div>
        <VBtn
          variant="tonal"
          @click="isPaymentProvidersDialogVisible = !isPaymentProvidersDialogVisible"
        >
          Choose a provider
        </VBtn>
      </VCardText>
    </VCard>

    <!-- 👉 Supported Payment Methods -->
    <VCard
      title="Supported payment methods"
      subtitle="Payment methods that are available with one of Vuexy's approved payment providers."
      class="mb-6"
    >
      <VCardText>
        <div class="text-body-1 font-weight-medium text-high-emphasis mb-6">
          Default
        </div>
        <div class="my-class mb-6">
          <div class="d-flex justify-space-between align-center mb-6">
            <VAvatar
              variant="elevated"
              color="#ffffff"
              rounded
              class="px-1"
            >
              <VImg
                :src="paypal"
                height="21"
                width="21"
              />
            </VAvatar>

            <VBtn variant="text">
              Activate PayPal
            </VBtn>
          </div>
          <VDivider />
          <div class="d-flex justify-space-between flex-wrap mt-6 gap-x-4">
            <div>
              <div class="text-body-2 mb-1">
                Provider
              </div>
              <div class="text-body-1 text-high-emphasis font-weight-medium">
                PayPal
              </div>
            </div>

            <div>
              <div class="text-body-2 mb-1">
                Status
              </div>
              <VChip
                color="warning"
                label
              >
                Inactive
              </VChip>
            </div>

            <div>
              <div class="text-body-2 mb-1">
                Transaction Fee
              </div>
              <div class="text-body-1 text-high-emphasis">
                2.99%
              </div>
            </div>
          </div>
        </div>
        <VBtn
          variant="tonal"
          @click="isAddPaymentMethodsDialogVisible = !isAddPaymentMethodsDialogVisible"
        >
          Add Payment Method
        </VBtn>
      </VCardText>
    </VCard>

    <!-- 👉 Manual Payment Methods -->
    <VCard
      title="Manual payment methods"
      class="mb-6"
    >
      <VCardText>
        <p>Payments that are made outside your online store. When a customer selects a manual payment method such as cash on delivery, you'll need to approve their order before it can be fulfilled.</p>

        <VBtn
          variant="tonal"
          :append-icon="$vuetify.display.smAndUp ? 'tabler-chevron-down' : ''"
        >
          <span>Add Manual Payment Methods</span>

          <VMenu activator="parent">
            <VList>
              <VListItem
                v-for="(item, index) in ['Create custom payment method', 'Bank Deposit', 'Money Order', 'Cash on Delivery(COD)']"
                :key="index"
                :value="index"
              >
                <VListItemTitle>{{ item }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </VCardText>
    </VCard>

    <div class="d-flex justify-end gap-x-4">
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Discard
      </VBtn>
      <VBtn color="primary">
        save
      </VBtn>
    </div>
  </div>

  <AddPaymentMethodDialog v-model:is-dialog-visible="isAddPaymentMethodsDialogVisible" />
  <PaymentProvidersDialog v-model:is-dialog-visible="isPaymentProvidersDialogVisible" />
</template>
