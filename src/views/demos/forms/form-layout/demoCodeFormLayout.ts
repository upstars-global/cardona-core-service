export const collapsible = {
  ts: `<script lang="ts" setup>
const stateList = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
]

const radios = ref('home')
const deliveryOption = ref('standard')
const paymentMethod = ref('credit-debit-card')
const panel = ref(0)

const paymentMethods = [
  {
    radioValue: 'credit-debit-card',
    radioLabel: 'Credit/Debit/ATM Card',
    icon: 'tabler-credit-card',
  },
  {
    radioValue: 'cash-on-delivery',
    radioLabel: 'Cash On Delivery',
    icon: 'tabler-help',
  },
]
</script>

<template>
  <VExpansionPanels v-model="panel">
    <!-- SECTION Delivery Address -->
    <VExpansionPanel>
      <VExpansionPanelTitle>Delivery Address</VExpansionPanelTitle>

      <VExpansionPanelText>
        <VForm
          class="pt-4 pb-2"
          @submit.prevent="() => {}"
        >
          <VRow>
            <!-- 👉 Full Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Full Name"
                placeholder="John Doe"
              />
            </VCol>
            <!-- 👉 Phone No -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Phone No"
                type="number"
                placeholder="+1 123 456 7890"
              />
            </VCol>
            <!-- 👉 Address -->
            <VCol cols="12">
              <AppTextarea
                label="Address"
                placeholder="1234 Main St, New York, NY 10001, USA"
                rows="3"
              />
            </VCol>
            <!-- 👉 Pincode -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Pincode"
                placeholder="123456"
                type="number"
              />
            </VCol>
            <!-- 👉 Landmark -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Landmark"
                placeholder="Near City Mall"
              />
            </VCol>
            <!-- 👉 City -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="City"
                placeholder="New York"
              />
            </VCol>
            <!-- 👉 State -->
            <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                :items="stateList"
                label="State"
                placeholder="Select State"
              />
            </VCol>
            <!-- 👉 Address Type  -->
            <VCol cols="12">
              <VLabel class="mb-3">
                Address Type
              </VLabel>
              <VRadioGroup
                v-model="radios"
                inline
              >
                <div>
                  <VRadio
                    label="Home (All day delivery)"
                    value="home"
                  />
                  <VRadio
                    label="Office (Delivery between 10 AM - 5 PM)"
                    value="office"
                  />
                </div>
              </VRadioGroup>
            </VCol>
          </VRow>
        </VForm>
      </VExpansionPanelText>
    </VExpansionPanel>
    <!-- !SECTION Delivery Address -->

    <!-- SECTION Delivery Options -->
    <VExpansionPanel>
      <VExpansionPanelTitle>Delivery Options</VExpansionPanelTitle>

      <VExpansionPanelText>
        <!-- 👉 Radio Group -->
        <VRadioGroup
          v-model="deliveryOption"
          class="delivery-options pt-4 pb-2"
        >
          <div
            class="delivery-option d-flex rounded-t"
            :class="deliveryOption === 'standard' ? 'active' : ''"
            @click="deliveryOption = 'standard'"
          >
            <VRadio
              inline
              value="standard"
              class="mt-n4"
            />
            <div class="w-100">
              <div class="d-flex justify-space-between">
                <h6 class="text-base font-weight-medium">
                  Standard 3-5 Days
                </h6>
                <h6 class="text-base font-weight-medium">
                  Free
                </h6>
              </div>
              <span class="text-sm">Friday, 15 Nov - Monday, 18 Nov</span>
            </div>
          </div>
          <div
            class="delivery-option d-flex"
            :class="deliveryOption === 'express' ? 'active' : ''"
            @click="deliveryOption = 'express'"
          >
            <VRadio
              inline
              class="mt-n4"
              value="express"
            />
            <div class="w-100">
              <div class="d-flex justify-space-between">
                <h5 class="text-base font-weight-medium">
                  Express
                </h5>
                <h6 class="text-base font-weight-medium">
                  $5.00
                </h6>
              </div>
              <span class="text-sm">Friday, 15 Nov - Sunday, 17 Nov</span>
            </div>
          </div>
          <div
            class="delivery-option d-flex rounded-b"
            :class="deliveryOption === 'overnight' ? 'active' : ''"
            @click="deliveryOption = 'overnight'"
          >
            <VRadio
              inline
              class="mt-n4"
              value="overnight"
            />
            <div class="w-100">
              <div class="d-flex justify-space-between">
                <h6 class="text-base font-weight-medium">
                  Overnight
                </h6>
                <h6 class="text-base font-weight-medium">
                  $10.00
                </h6>
              </div>
              <span class="text-sm">Friday, 15 Nov - Saturday, 16 Nov</span>
            </div>
          </div>
        </VRadioGroup>
      </VExpansionPanelText>
    </VExpansionPanel>
    <!-- !SECTION Delivery Options -->

    <!-- SECTION Payment Method -->
    <VExpansionPanel>
      <VExpansionPanelTitle>Payment Method</VExpansionPanelTitle>

      <VExpansionPanelText>
        <VRow>
          <VCol
            md="6"
            cols="12"
          >
            <VForm class="pt-4 pb-2">
              <!-- 👉 Payment Method -->
              <div>
                <VRadioGroup
                  v-model="paymentMethod"
                  inline
                >
                  <div>
                    <VRadio
                      v-for="payment in paymentMethods"
                      :key="payment.radioValue"
                      :value="payment.radioValue"
                    >
                      <template #label>
                        <span class="me-1">{{ payment.radioLabel }}</span>
                        <VIcon
                          size="18"
                          :icon="payment.icon"
                        />
                      </template>
                    </VRadio>
                  </div>
                </VRadioGroup>
              </div>

              <VRow v-show="paymentMethod === 'credit-debit-card'">
                <!-- 👉 Card Number -->
                <VCol cols="12">
                  <VTextField
                    label="Card Number"
                    type="number"
                    placeholder="1234 5678 9012 3456"
                  />
                </VCol>

                <!-- 👉 Name -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    label="Name"
                    placeholder="john doe"
                  />
                </VCol>

                <!-- 👉 Expire Date -->
                <VCol
                  cols="6"
                  md="3"
                >
                  <VTextField
                    label="Expiry Date"
                    placeholder="MM/YY"
                  />
                </VCol>

                <!-- 👉 CVV Code -->
                <VCol
                  cols="6"
                  md="3"
                >
                  <VTextField
                    label="CVV Code"
                    type="number"
                    max="3"
                    placeholder="123"
                  />
                </VCol>
              </VRow>
            </VForm>
          </VCol>
        </VRow>

        <VDivider class="my-5" />

        <!-- 👉 Place Order -->
        <div class="d-flex gap-4">
          <VBtn>Place Order</VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
          >
            Cancel
          </VBtn>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
    <!-- !SECTION Payment Method -->
  </VExpansionPanels>
</template>

<style lang="scss">
.delivery-options {
  cursor: pointer;

  .v-selection-control-group {
    inline-size: 100%;
  }
}

.delivery-option {
  padding: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  &.active {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>
`,
  js: `<script setup>
const stateList = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
]

const radios = ref('home')
const deliveryOption = ref('standard')
const paymentMethod = ref('credit-debit-card')
const panel = ref(0)

const paymentMethods = [
  {
    radioValue: 'credit-debit-card',
    radioLabel: 'Credit/Debit/ATM Card',
    icon: 'tabler-credit-card',
  },
  {
    radioValue: 'cash-on-delivery',
    radioLabel: 'Cash On Delivery',
    icon: 'tabler-help',
  },
]
</script>

<template>
  <VExpansionPanels v-model="panel">
    <!-- SECTION Delivery Address -->
    <VExpansionPanel>
      <VExpansionPanelTitle>Delivery Address</VExpansionPanelTitle>

      <VExpansionPanelText>
        <VForm
          class="pt-4 pb-2"
          @submit.prevent="() => {}"
        >
          <VRow>
            <!-- 👉 Full Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Full Name"
                placeholder="John Doe"
              />
            </VCol>
            <!-- 👉 Phone No -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Phone No"
                type="number"
                placeholder="+1 123 456 7890"
              />
            </VCol>
            <!-- 👉 Address -->
            <VCol cols="12">
              <AppTextarea
                label="Address"
                placeholder="1234 Main St, New York, NY 10001, USA"
                rows="3"
              />
            </VCol>
            <!-- 👉 Pincode -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Pincode"
                placeholder="123456"
                type="number"
              />
            </VCol>
            <!-- 👉 Landmark -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="Landmark"
                placeholder="Near City Mall"
              />
            </VCol>
            <!-- 👉 City -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                label="City"
                placeholder="New York"
              />
            </VCol>
            <!-- 👉 State -->
            <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                :items="stateList"
                label="State"
                placeholder="Select State"
              />
            </VCol>
            <!-- 👉 Address Type  -->
            <VCol cols="12">
              <VLabel class="mb-3">
                Address Type
              </VLabel>
              <VRadioGroup
                v-model="radios"
                inline
              >
                <div>
                  <VRadio
                    label="Home (All day delivery)"
                    value="home"
                  />
                  <VRadio
                    label="Office (Delivery between 10 AM - 5 PM)"
                    value="office"
                  />
                </div>
              </VRadioGroup>
            </VCol>
          </VRow>
        </VForm>
      </VExpansionPanelText>
    </VExpansionPanel>
    <!-- !SECTION Delivery Address -->

    <!-- SECTION Delivery Options -->
    <VExpansionPanel>
      <VExpansionPanelTitle>Delivery Options</VExpansionPanelTitle>

      <VExpansionPanelText>
        <!-- 👉 Radio Group -->
        <VRadioGroup
          v-model="deliveryOption"
          class="delivery-options pt-4 pb-2"
        >
          <div
            class="delivery-option d-flex rounded-t"
            :class="deliveryOption === 'standard' ? 'active' : ''"
            @click="deliveryOption = 'standard'"
          >
            <VRadio
              inline
              value="standard"
              class="mt-n4"
            />
            <div class="w-100">
              <div class="d-flex justify-space-between">
                <h6 class="text-base font-weight-medium">
                  Standard 3-5 Days
                </h6>
                <h6 class="text-base font-weight-medium">
                  Free
                </h6>
              </div>
              <span class="text-sm">Friday, 15 Nov - Monday, 18 Nov</span>
            </div>
          </div>
          <div
            class="delivery-option d-flex"
            :class="deliveryOption === 'express' ? 'active' : ''"
            @click="deliveryOption = 'express'"
          >
            <VRadio
              inline
              class="mt-n4"
              value="express"
            />
            <div class="w-100">
              <div class="d-flex justify-space-between">
                <h5 class="text-base font-weight-medium">
                  Express
                </h5>
                <h6 class="text-base font-weight-medium">
                  $5.00
                </h6>
              </div>
              <span class="text-sm">Friday, 15 Nov - Sunday, 17 Nov</span>
            </div>
          </div>
          <div
            class="delivery-option d-flex rounded-b"
            :class="deliveryOption === 'overnight' ? 'active' : ''"
            @click="deliveryOption = 'overnight'"
          >
            <VRadio
              inline
              class="mt-n4"
              value="overnight"
            />
            <div class="w-100">
              <div class="d-flex justify-space-between">
                <h6 class="text-base font-weight-medium">
                  Overnight
                </h6>
                <h6 class="text-base font-weight-medium">
                  $10.00
                </h6>
              </div>
              <span class="text-sm">Friday, 15 Nov - Saturday, 16 Nov</span>
            </div>
          </div>
        </VRadioGroup>
      </VExpansionPanelText>
    </VExpansionPanel>
    <!-- !SECTION Delivery Options -->

    <!-- SECTION Payment Method -->
    <VExpansionPanel>
      <VExpansionPanelTitle>Payment Method</VExpansionPanelTitle>

      <VExpansionPanelText>
        <VRow>
          <VCol
            md="6"
            cols="12"
          >
            <VForm class="pt-4 pb-2">
              <!-- 👉 Payment Method -->
              <div>
                <VRadioGroup
                  v-model="paymentMethod"
                  inline
                >
                  <div>
                    <VRadio
                      v-for="payment in paymentMethods"
                      :key="payment.radioValue"
                      :value="payment.radioValue"
                    >
                      <template #label>
                        <span class="me-1">{{ payment.radioLabel }}</span>
                        <VIcon
                          size="18"
                          :icon="payment.icon"
                        />
                      </template>
                    </VRadio>
                  </div>
                </VRadioGroup>
              </div>

              <VRow v-show="paymentMethod === 'credit-debit-card'">
                <!-- 👉 Card Number -->
                <VCol cols="12">
                  <VTextField
                    label="Card Number"
                    type="number"
                    placeholder="1234 5678 9012 3456"
                  />
                </VCol>

                <!-- 👉 Name -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    label="Name"
                    placeholder="john doe"
                  />
                </VCol>

                <!-- 👉 Expire Date -->
                <VCol
                  cols="6"
                  md="3"
                >
                  <VTextField
                    label="Expiry Date"
                    placeholder="MM/YY"
                  />
                </VCol>

                <!-- 👉 CVV Code -->
                <VCol
                  cols="6"
                  md="3"
                >
                  <VTextField
                    label="CVV Code"
                    type="number"
                    max="3"
                    placeholder="123"
                  />
                </VCol>
              </VRow>
            </VForm>
          </VCol>
        </VRow>

        <VDivider class="my-5" />

        <!-- 👉 Place Order -->
        <div class="d-flex gap-4">
          <VBtn>Place Order</VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
          >
            Cancel
          </VBtn>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
    <!-- !SECTION Payment Method -->
  </VExpansionPanels>
</template>

<style lang="scss">
.delivery-options {
  cursor: pointer;

  .v-selection-control-group {
    inline-size: 100%;
  }
}

.delivery-option {
  padding: 1rem;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

  &.active {
    border-color: rgb(var(--v-theme-primary));
  }
}
</style>
`,
}

export const formHint = {
  ts: `<script lang="ts" setup>
const username = ref('')
const email = ref('')
const password = ref<string>()
const checkbox = ref(false)
const items = ['foo', 'bar', 'fizz', 'buzz'] as const
const values = ref<typeof items[number][]>([])
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <!-- 👉 Username -->
        <AppTextField
          v-model="username"
          label="Username"
          placeholder="Johndoe"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Email -->
        <AppTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Password -->
        <AppTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          persistent-hint
          placeholder="············"
          hint="Your password must be 8-20 characters long."
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Autocomplete -->
        <AppAutocomplete
          v-model="values"
          :items="items"
          chips
          multiple
          label="Autocomplete"
          placeholder="Select"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Checkbox -->
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <!-- 👉 submit and reset button -->
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
  js: `<script setup>
const username = ref('')
const email = ref('')
const password = ref()
const checkbox = ref(false)

const items = [
  'foo',
  'bar',
  'fizz',
  'buzz',
]

const values = ref([])
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <!-- 👉 Username -->
        <AppTextField
          v-model="username"
          label="Username"
          placeholder="Johndoe"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Email -->
        <AppTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Password -->
        <AppTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          persistent-hint
          placeholder="············"
          hint="Your password must be 8-20 characters long."
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Autocomplete -->
        <AppAutocomplete
          v-model="values"
          :items="items"
          chips
          multiple
          label="Autocomplete"
          placeholder="Select"
        />
      </VCol>

      <VCol cols="12">
        <!-- 👉 Checkbox -->
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <!-- 👉 submit and reset button -->
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
}

export const formSticky = {
  ts: `<script setup lang="ts">
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
`,
  js: `<script setup>
const radioContent = [
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
`,
}

export const formValidation = {
  ts: `<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components/VForm'

const name = ref('')
const email = ref('')
const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'] as const
const select = ref<typeof items[number]>()
const checkbox = ref(false)
const form = ref<VForm>()
</script>

<template>
  <VForm
    ref="form"
    lazy-validation
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="name"
          :rules="[requiredValidator]"
          label="Name"
          placeholder="John Doe"
          required
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="email"
          :rules="[emailValidator, requiredValidator]"
          label="E-mail"
          placeholder="johndoe@email.com"
          required
        />
      </VCol>

      <VCol cols="12">
        <AppSelect
          v-model="select"
          :items="items"
          :rules="[requiredValidator]"
          placeholder="Select an Item"
          label="Item"
          name="select"
          require
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          :rules="[requiredValidator]"
          label="Do you agree?"
          required
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex flex-wrap gap-4"
      >
        <VBtn
          color="success"
          @click="form?.validate()"
        >
          Validate
        </VBtn>

        <VBtn
          color="error"
          @click="form?.reset()"
        >
          Reset Form
        </VBtn>

        <VBtn
          color="warning"
          @click="form?.resetValidation()"
        >
          Reset Validation
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
  js: `<script setup>
const name = ref('')
const email = ref('')

const items = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
]

const select = ref()
const checkbox = ref(false)
const form = ref()
</script>

<template>
  <VForm
    ref="form"
    lazy-validation
  >
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="name"
          :rules="[requiredValidator]"
          label="Name"
          placeholder="John Doe"
          required
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="email"
          :rules="[emailValidator, requiredValidator]"
          label="E-mail"
          placeholder="johndoe@email.com"
          required
        />
      </VCol>

      <VCol cols="12">
        <AppSelect
          v-model="select"
          :items="items"
          :rules="[requiredValidator]"
          placeholder="Select an Item"
          label="Item"
          name="select"
          require
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          :rules="[requiredValidator]"
          label="Do you agree?"
          required
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex flex-wrap gap-4"
      >
        <VBtn
          color="success"
          @click="form?.validate()"
        >
          Validate
        </VBtn>

        <VBtn
          color="error"
          @click="form?.reset()"
        >
          Reset Form
        </VBtn>

        <VBtn
          color="warning"
          @click="form?.resetValidation()"
        >
          Reset Validation
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
}

export const formWithTabs = {
  ts: `<script lang="ts" setup>
const tab = ref('personal-info')
const firstName = ref('')
const lastName = ref('')
const country = ref()
const birthDate = ref('')
const phoneNo = ref<number>()
const countryList = ['USA', 'Canada', 'UK', 'Denmark', 'Germany', 'Iceland', 'Israel', 'Mexico']
const languageList = ['English', 'German', 'French', 'Spanish', 'Portuguese', 'Russian', 'Korean'] as const
const username = ref('')
const email = ref('')
const password = ref('')
const cPassword = ref('')
const twitterLink = ref('')
const facebookLink = ref('')
const googlePlusLink = ref('')
const linkedInLink = ref('')
const instagramLink = ref('')
const quoraLink = ref('')
const languages = ref<typeof languageList[number][]>([])
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
</script>

<template>
  <VTabs v-model="tab">
    <VTab value="personal-info">
      Personal Info
    </VTab>
    <VTab value="account-details">
      Account Details
    </VTab>
    <VTab value="social-links">
      Social Links
    </VTab>
  </VTabs>

  <VCard flat>
    <VCardText>
      <VWindow
        v-model="tab"
        class="disable-tab-transition"
      >
        <VWindowItem value="personal-info">
          <VForm class="mt-2">
            <VRow>
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="firstName"
                  label="First name"
                  placeholder="John"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="lastName"
                  label="Last name"
                  placeholder="Doe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="country"
                  :items="countryList"
                  label="Country"
                  placeholder="Select Country"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="languages"
                  :items="languageList"
                  multiple
                  chips
                  clearable
                  label="Language"
                  placeholder="Select Language"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="birthDate"
                  label="Birth Date"
                  placeholder="Select Birth Date"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="phoneNo"
                  type="number"
                  label="Phone No."
                  placeholder="+1 123 456 7890"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="account-details">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="username"
                  label="Username"
                  placeholder="Johndoe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="email"
                  label="Email"
                  suffix="@example.com"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="cPassword"
                  label="Confirm Password"
                  placeholder="············"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="social-links">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="twitterLink"
                  label="Twitter"
                  placeholder="https://twitter.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="facebookLink"
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="googlePlusLink"
                  label="Google+"
                  placeholder="https://plus.google.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="linkedInLink"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="instagramLink"
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="quoraLink"
                  label="Quora"
                  placeholder="https://quora.com/username"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>

    <VDivider />

    <VCardText class="d-flex gap-4">
      <VBtn>Submit</VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Cancel
      </VBtn>
    </VCardText>
  </VCard>
</template>
`,
  js: `<script setup>
const tab = ref('personal-info')
const firstName = ref('')
const lastName = ref('')
const country = ref()
const birthDate = ref('')
const phoneNo = ref()

const countryList = [
  'USA',
  'Canada',
  'UK',
  'Denmark',
  'Germany',
  'Iceland',
  'Israel',
  'Mexico',
]

const languageList = [
  'English',
  'German',
  'French',
  'Spanish',
  'Portuguese',
  'Russian',
  'Korean',
]

const username = ref('')
const email = ref('')
const password = ref('')
const cPassword = ref('')
const twitterLink = ref('')
const facebookLink = ref('')
const googlePlusLink = ref('')
const linkedInLink = ref('')
const instagramLink = ref('')
const quoraLink = ref('')
const languages = ref([])
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
</script>

<template>
  <VTabs v-model="tab">
    <VTab value="personal-info">
      Personal Info
    </VTab>
    <VTab value="account-details">
      Account Details
    </VTab>
    <VTab value="social-links">
      Social Links
    </VTab>
  </VTabs>

  <VCard flat>
    <VCardText>
      <VWindow
        v-model="tab"
        class="disable-tab-transition"
      >
        <VWindowItem value="personal-info">
          <VForm class="mt-2">
            <VRow>
              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="firstName"
                  label="First name"
                  placeholder="John"
                />
              </VCol>

              <VCol
                md="6"
                cols="12"
              >
                <AppTextField
                  v-model="lastName"
                  label="Last name"
                  placeholder="Doe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="country"
                  :items="countryList"
                  label="Country"
                  placeholder="Select Country"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppSelect
                  v-model="languages"
                  :items="languageList"
                  multiple
                  chips
                  clearable
                  label="Language"
                  placeholder="Select Language"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppDateTimePicker
                  v-model="birthDate"
                  label="Birth Date"
                  placeholder="Select Birth Date"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="phoneNo"
                  type="number"
                  label="Phone No."
                  placeholder="+1 123 456 7890"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="account-details">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="username"
                  label="Username"
                  placeholder="Johndoe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="email"
                  label="Email"
                  suffix="@example.com"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="cPassword"
                  label="Confirm Password"
                  placeholder="············"
                  :type="isCPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem value="social-links">
          <VForm class="mt-2">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="twitterLink"
                  label="Twitter"
                  placeholder="https://twitter.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="facebookLink"
                  label="Facebook"
                  placeholder="https://facebook.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="googlePlusLink"
                  label="Google+"
                  placeholder="https://plus.google.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="linkedInLink"
                  label="LinkedIn"
                  placeholder="https://linkedin.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="instagramLink"
                  label="Instagram"
                  placeholder="https://instagram.com/username"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  v-model="quoraLink"
                  label="Quora"
                  placeholder="https://quora.com/username"
                />
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>

    <VDivider />

    <VCardText class="d-flex gap-4">
      <VBtn>Submit</VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Cancel
      </VBtn>
    </VCardText>
  </VCard>
</template>
`,
}

export const horizontalForm = {
  ts: `<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref<number>()
const password = ref<string>()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="firstName"
            >First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="firstName"
              v-model="firstName"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Email -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="email"
            >Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="email"
              v-model="email"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Mobile -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="mobile"
            >Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="mobile"
              v-model="mobile"
              type="number"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Password -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="password"
            >Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="password"
              v-model="password"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Remember me -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
      >
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          type="reset"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
  js: `<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref()
const password = ref()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="firstName"
            >First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="firstName"
              v-model="firstName"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Email -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="email"
            >Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="email"
              v-model="email"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Mobile -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="mobile"
            >Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="mobile"
              v-model="mobile"
              type="number"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <VCol cols="12">
        <VRow no-gutters>
          <!-- 👉 Password -->
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="password"
            >Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="password"
              v-model="password"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Remember me -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
      >
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          type="reset"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
}

export const horizontalFormWithIcons = {
  ts: `<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref<number>()
const password = ref<string>()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="firstNameHorizontalIcons"
            >First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="firstNameHorizontalIcons"
              v-model="firstName"
              prepend-inner-icon="tabler-user"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Email -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="emailHorizontalIcons"
            >Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="emailHorizontalIcons"
              v-model="email"
              prepend-inner-icon="tabler-mail"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Mobile -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="mobileHorizontalIcons"
            >Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="mobileHorizontalIcons"
              v-model="mobile"
              type="number"
              prepend-inner-icon="tabler-device-mobile"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Password -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="passwordHorizontalIcons"
            >Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="passwordHorizontalIcons"
              v-model="password"
              prepend-inner-icon="tabler-lock"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Checkbox -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
      >
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>
        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
  js: `<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref()
const password = ref()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="firstNameHorizontalIcons"
            >First Name</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="firstNameHorizontalIcons"
              v-model="firstName"
              prepend-inner-icon="tabler-user"
              placeholder="John"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Email -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="emailHorizontalIcons"
            >Email</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="emailHorizontalIcons"
              v-model="email"
              prepend-inner-icon="tabler-mail"
              placeholder="johndoe@email.com"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Mobile -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="mobileHorizontalIcons"
            >Mobile</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="mobileHorizontalIcons"
              v-model="mobile"
              type="number"
              prepend-inner-icon="tabler-device-mobile"
              placeholder="+1 123 456 7890"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Password -->
      <VCol cols="12">
        <VRow no-gutters>
          <VCol
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <label
              class="v-label text-body-2 text-high-emphasis"
              for="passwordHorizontalIcons"
            >Password</label>
          </VCol>

          <VCol
            cols="12"
            md="9"
          >
            <AppTextField
              id="passwordHorizontalIcons"
              v-model="password"
              prepend-inner-icon="tabler-lock"
              autocomplete="on"
              type="password"
              placeholder="············"
              persistent-placeholder
            />
          </VCol>
        </VRow>
      </VCol>

      <!-- 👉 Checkbox -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
      >
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <!-- 👉 submit and reset button -->
      <VCol
        offset-md="3"
        cols="12"
        md="9"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>
        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
}

export const multipleColumn = {
  ts: `<script lang="ts" setup>
const firstName = ref('')
const lastName = ref('')
const city = ref('')
const country = ref('')
const company = ref('')
const email = ref('')
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <!-- 👉 Last Name -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="lastName"
          label="Last Name"
          placeholder="Doe"
        />
      </VCol>

      <!-- 👉 Email -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="email"
          label="Email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <!-- 👉 City -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="city"
          label="City"
          placeholder="New York"
        />
      </VCol>

      <!-- 👉 Country -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="country"
          label="Country"
          placeholder="United States"
        />
      </VCol>

      <!-- 👉 Company -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="company"
          label="Company"
          placeholder="Pixinvent"
        />
      </VCol>

      <!-- 👉 Remember me -->
      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
  js: `<script setup>
const firstName = ref('')
const lastName = ref('')
const city = ref('')
const country = ref('')
const company = ref('')
const email = ref('')
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <!-- 👉 First Name -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <!-- 👉 Last Name -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="lastName"
          label="Last Name"
          placeholder="Doe"
        />
      </VCol>

      <!-- 👉 Email -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="email"
          label="Email"
          placeholder="johndoe@email.com"
        />
      </VCol>

      <!-- 👉 City -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="city"
          label="City"
          placeholder="New York"
        />
      </VCol>

      <!-- 👉 Country -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="country"
          label="Country"
          placeholder="United States"
        />
      </VCol>

      <!-- 👉 Company -->
      <VCol
        cols="12"
        md="6"
      >
        <AppTextField
          v-model="company"
          label="Company"
          placeholder="Pixinvent"
        />
      </VCol>

      <!-- 👉 Remember me -->
      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
}

export const sticky = {
  ts: `<script setup lang="ts">
import type { CustomInputContent } from '@core/types'

const radioContent: CustomInputContent[] = [
  {
    title: 'Standard',
    desc: 'Delivery in 3-5 days.',
    value: 'standard',
    icon: { icon: 'tabler-briefcase-2', size: '32' },
  },
  {
    title: 'Express',
    desc: 'Delivery within 2 days.',
    value: 'express',
    icon: { icon: 'tabler-rocket', size: '32' },
  },
  {
    title: 'Overnight',
    desc: 'Delivery within a days.',
    value: 'overnight',
    icon: { icon: 'tabler-crown', size: '32' },
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
  state: null,
  defaultAddress: false,
  addressType: 'home',
  deliveryType: 'overnight',
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
                <AppTextField
                  v-model="formData.fullName"
                  label="Full Name"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
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
                <AppTextField
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
                <AppTextField
                  v-model="formData.altContactNumber"
                  label="Alternate Number"
                  placeholder="658 123 4567"
                  type="number"
                />
              </VCol>

              <VCol cols="12">
                <AppTextarea
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
                <AppTextField
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
                <AppTextField
                  v-model="formData.Landmark"
                  label="Landmark"
                  placeholder="Nr. Wall Street"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
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
                  placeholder="Select State"
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
              <AppTextField
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
                  <VBtn variant="tonal">
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
                <AppTextField
                  label="Card Number"
                  placeholder="1356 3215 6548 7898"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="Name"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol
                cols="6"
                md="3"
              >
                <AppTextField
                  label="Exp. Date"
                  placeholder="MM/YY"
                />
              </VCol>
              <VCol
                cols="6"
                md="3"
              >
                <AppTextField
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
`,
  js: `<script setup>
const radioContent = [
  {
    title: 'Standard',
    desc: 'Delivery in 3-5 days.',
    value: 'standard',
    icon: {
      icon: 'tabler-briefcase-2',
      size: '32',
    },
  },
  {
    title: 'Express',
    desc: 'Delivery within 2 days.',
    value: 'express',
    icon: {
      icon: 'tabler-rocket',
      size: '32',
    },
  },
  {
    title: 'Overnight',
    desc: 'Delivery within a days.',
    value: 'overnight',
    icon: {
      icon: 'tabler-crown',
      size: '32',
    },
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
  state: null,
  defaultAddress: false,
  addressType: 'home',
  deliveryType: 'overnight',
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
                <AppTextField
                  v-model="formData.fullName"
                  label="Full Name"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
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
                <AppTextField
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
                <AppTextField
                  v-model="formData.altContactNumber"
                  label="Alternate Number"
                  placeholder="658 123 4567"
                  type="number"
                />
              </VCol>

              <VCol cols="12">
                <AppTextarea
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
                <AppTextField
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
                <AppTextField
                  v-model="formData.Landmark"
                  label="Landmark"
                  placeholder="Nr. Wall Street"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
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
                  placeholder="Select State"
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
              <AppTextField
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
                  <VBtn variant="tonal">
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
                <AppTextField
                  label="Card Number"
                  placeholder="1356 3215 6548 7898"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <AppTextField
                  label="Name"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol
                cols="6"
                md="3"
              >
                <AppTextField
                  label="Exp. Date"
                  placeholder="MM/YY"
                />
              </VCol>
              <VCol
                cols="6"
                md="3"
              >
                <AppTextField
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
`,
}

export const verticalForm = {
  ts: `<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref<number>()
const password = ref<string>()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="mobile"
          label="Mobile"
          placeholder="+1 123 456 7890"
          type="number"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
  js: `<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref()
const password = ref()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="firstName"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="email"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="mobile"
          label="Mobile"
          placeholder="+1 123 456 7890"
          type="number"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="password"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol
        cols="12"
        class="d-flex gap-4"
      >
        <VBtn type="submit">
          Submit
        </VBtn>

        <VBtn
          type="reset"
          color="secondary"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
}

export const verticalFormWithIcons = {
  ts: `<script lang="ts" setup>
const firstName = ref('')
const email = ref('')
const mobile = ref<number>()
const password = ref<string>()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="{}">
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="firstName"
          prepend-inner-icon="tabler-user"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="email"
          prepend-inner-icon="tabler-mail"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="mobile"
          prepend-inner-icon="tabler-device-mobile"
          label="Mobile"
          placeholder="+1 123 456 7890"
          type="number"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="password"
          prepend-inner-icon="tabler-lock"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-2"
        >
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
  js: `<script setup>
const firstName = ref('')
const email = ref('')
const mobile = ref()
const password = ref()
const checkbox = ref(false)
</script>

<template>
  <VForm @submit.prevent="{}">
    <VRow>
      <VCol cols="12">
        <AppTextField
          v-model="firstName"
          prepend-inner-icon="tabler-user"
          label="First Name"
          placeholder="John"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="email"
          prepend-inner-icon="tabler-mail"
          label="Email"
          type="email"
          placeholder="johndoe@example.com"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="mobile"
          prepend-inner-icon="tabler-device-mobile"
          label="Mobile"
          placeholder="+1 123 456 7890"
          type="number"
        />
      </VCol>

      <VCol cols="12">
        <AppTextField
          v-model="password"
          prepend-inner-icon="tabler-lock"
          label="Password"
          autocomplete="on"
          type="password"
          placeholder="············"
        />
      </VCol>

      <VCol cols="12">
        <VCheckbox
          v-model="checkbox"
          label="Remember me"
        />
      </VCol>

      <VCol cols="12">
        <VBtn
          type="submit"
          class="me-2"
        >
          Submit
        </VBtn>

        <VBtn
          color="secondary"
          type="reset"
          variant="tonal"
        >
          Reset
        </VBtn>
      </VCol>
    </VRow>
  </VForm>
</template>
`,
}
