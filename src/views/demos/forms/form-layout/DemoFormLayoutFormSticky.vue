<script setup lang="ts">
import type { CustomInputContent } from '@core/types'

const radioContent: CustomInputContent[] = [
  {
    title: 'Standard',
    desc: 'Delivery in 3-5 days.',
    value: 'standard',
    icon: 'tabler-briefcase',
  },
  {
    title: 'Express',
    desc: 'Delivery within 2 days.',
    value: 'express',
    icon: 'tabler-rocket',
  },
  {
    title: 'Overnight',
    desc: 'Delivery within a days.',
    value: 'overnight',
    icon: 'tabler-crown',
  },
]

const promoCodeList = [
  {
    code: 'TAKEITALL',
    desc: 'Apply this code to get 15% discount on orders above 20$.',
  },
  {
    code: 'FESTIVE10',
    desc: 'Apply this code to get 10% discount on all orders.',
  },
  {
    code: 'MYSTERYDEAL',
    desc: 'Apply this code to get discount between 10% - 50%.',
  },
]

const formData = ref({
  fullName: '',
  email: '',
  contactNumber: null,
  altContactNumber: null,
  address: '',
  pincode: null,
  Landmark: '',
  city: '',
  state: '',
  defaultAddress: false,
  addressType: 'home',
  deliveryType: 'standard',
  promoCode: '',
  paymentMethod: 'card',
  cardNumber: null,
  cardName: '',
  cardExDate: '',
  cardCvv: '',
})
</script>

<template>
  <VCard class="overflow-visible">
    <div class="w-100 sticky-header">
      <div class=" d-flex align-center gap-4 flex-wrap bg-background pa-6">
        <VCardTitle>Sticky Action Bar</VCardTitle>
        <VSpacer />
        <div>
          <VBtn
            variant="tonal"
            class="me-5"
          >
            Back
          </VBtn>
          <VBtn>Place Order</VBtn>
        </div>
      </div>
    </div>

    <VCardText>
      <VRow>
        <VCol
          md="8"
          cols="12"
          class="mx-auto"
        >
          <VForm>
            <h2 class="text-lg font-weight-medium mb-6">
              1. Delivery Address
            </h2>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.fullName"
                  label="Full Name"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.email"
                  label="Email"
                  placeholder="john.doe"
                  suffix="@example.com"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.contactNumber"
                  label="Contact Number"
                  placeholder="658 123 4567"
                  type="number"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.altContactNumber"
                  label="Alternate Number"
                  placeholder="658 123 4567"
                  type="number"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="formData.address"
                  label="Address"
                  placeholder="1456, Mall Road"
                  rows="2"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.pincode"
                  label="Pincode"
                  placeholder="658468"
                  type="number"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.Landmark"
                  label="Landmark"
                  placeholder="Nr. Wall Street"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="formData.city"
                  label="City"
                  placeholder="Jackson"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="formData.state"
                  label="State"
                  placeholder="California"
                  :items="['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida']"
                />
              </VCol>

              <VCol cols="12">
                <VCheckbox
                  v-model="formData.defaultAddress"
                  label="Use this as default delivery address"
                />
              </VCol>

              <VCol cols="12">
                <p class="text-high-emphasis text-base mb-1">
                  Address Type
                </p>
                <VRadioGroup
                  v-model="formData.addressType"
                  inline
                >
                  <VRadio
                    label="Home (All day delivery)"
                    value="home"
                  />
                  <VRadio
                    label="Office (Delivery between 10 AM - 5 PM)"
                    value="work"
                  />
                </VRadioGroup>
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <h2 class="text-lg font-weight-medium mb-6">
              2. Delivery Type
            </h2>

            <CustomRadiosWithIcon
              v-model:selected-radio="formData.deliveryType"
              :radio-content="radioContent"
              :grid-column="{ sm: '4', cols: '12' }"
            />

            <VDivider class="my-4" />

            <h2 class="text-lg font-weight-medium mb-6">
              3. Apply Promo code
            </h2>

            <div class="d-flex align-center gap-4">
              <VTextField
                v-model="formData.promoCode"
                density="compact"
                placeholder="TAKEITALL"
              />
              <VBtn>Apply</VBtn>
            </div>

            <div class="d-flex align-center gap-2 my-4">
              <VDivider style="border-style: dashed;" />
              <span>OR</span>
              <VDivider style="border-style: dashed;" />
            </div>

            <VList
              class="border rounded py-0"
              lines="two"
            >
              <VListItem
                v-for="(item, index) in promoCodeList"
                :key="item.code"
                :title="item.code"
                :subtitle="item.desc"
                :class="index !== 0 ? 'border-t' : ''"
              >
                <template #append>
                  <VBtn variant="outlined">
                    Apply
                  </VBtn>
                </template>
              </VListItem>
            </VList>

            <VDivider class="my-4" />

            <h2 class="text-lg font-weight-medium mb-6">
              4. Payment Method
            </h2>

            <VRadioGroup
              v-model="formData.paymentMethod"
              inline
              class="mb-4"
            >
              <VRadio
                value="card"
                label="Credit/Debit/ATM Card"
              />
              <VRadio
                value="cash-on-delivery"
                label="Cash On Delivery"
              />
            </VRadioGroup>

            <VRow v-show="formData.paymentMethod === 'card'">
              <VCol cols="12">
                <VTextField
                  label="Card Number"
                  placeholder="1356 3215 6548 7898"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  label="Name"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol
                cols="6"
                md="3"
              >
                <VTextField
                  label="Exp. Date"
                  placeholder="MM/YY"
                />
              </VCol>
              <VCol
                cols="6"
                md="3"
              >
                <VTextField
                  label="CVV Code"
                  placeholder="654"
                />
              </VCol>
            </VRow>

            <div v-show="formData.paymentMethod === 'cash-on-delivery'">
              <p>
                Cash on delivery is a mode of payment where you make the payment after the goods/services are received.
              </p>
              <p>You can pay cash or make the payment via debit/credit card directly to the delivery person.</p>
            </div>
          </VForm>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.sticky-header {
  position: sticky;
  z-index: 9;
  inset-block-end: 0;
  inset-block-start: 4rem;
  transition: all 0.3s ease-in-out;
}
</style>
