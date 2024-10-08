<script setup lang="ts">
import { ref, toRaw } from 'vue';

interface BillingAddress {
  companyName: string
  billingEmail: string
  taxID: string
  vatNumber: string
  address: string
  contact: string
  country: string | null
  state: string
  zipCode: number | null
}
interface Props {
  billingAddress?: BillingAddress
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submit', value: BillingAddress): void
}

const props = withDefaults(defineProps<Props>(), {
  billingAddress: () => ({
    companyName: '',
    billingEmail: '',
    taxID: '',
    vatNumber: '',
    address: '',
    contact: '',
    country: null,
    state: '',
    zipCode: null,
  }),
})

const emit = defineEmits<Emit>()

const billingAddress = ref<BillingAddress>(structuredClone(toRaw(props.billingAddress)))

const resetForm = () => {
  emit('update:isDialogVisible', false)
  billingAddress.value = structuredClone(toRaw(props.billingAddress))
}

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', billingAddress.value)
}

const selectedAddress = ref('Home')

const addressTypes = [
  {
    icon: { icon: 'custom-home', size: '40' },
    title: 'Home',
    desc: 'Delivery Time (7am - 9pm)',
    value: 'Home',
  },
  {
    icon: { icon: 'custom-office', size: '40' },
    title: 'Office',
    desc: 'Delivery Time (10am - 6pm)',
    value: 'Office',
  },
]
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 610 "
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard
      v-if="props.billingAddress"
      class="pa-sm-8 pa-5"
    >
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h3 text-center">
          {{ props.billingAddress.address ? 'Edit' : 'Add New' }} Address
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Subtitle -->
        <VCardSubtitle class="text-center mb-6">
          <span class="text-base">

            Add new address for express delivery
          </span>
        </VCardSubtitle>

        <div class="d-flex">
          <CustomRadiosWithIcon
            v-model:selected-radio="selectedAddress"
            :radio-content="addressTypes"
            :grid-column="{ sm: '6', cols: '12' }"
          />
        </div>

        <!-- 👉 Form -->
        <VForm
          class="mt-4"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 Company Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.companyName"
                label="Company Name"
                placeholder="Pixinvent"
              />
            </VCol>

            <!-- 👉 Email -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.billingEmail"
                label="Email"
                placeholder="john@emaill.com"
              />
            </VCol>

            <!-- 👉 Tax ID -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.taxID"
                label="Tax ID"
                placeholder="123 345 32"
              />
            </VCol>

            <!-- 👉 VAT Number -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.vatNumber"
                label="VAT Number"
                placeholder="123 12 1223"
              />
            </VCol>

            <!-- 👉 Billing Address -->
            <VCol cols="12">
              <AppTextarea
                v-model="billingAddress.address"
                rows="2"
                label="Billing Address"
                placeholder="1, Pixinvent Street, USA"
              />
            </VCol>

            <!-- 👉 Contact -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.contact"
                label="Contact"
                placeholder="+1 23 456 7890"
              />
            </VCol>

            <!-- 👉 Country -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.country"
                label="Country"
                placeholder="USA"
              />
            </VCol>

            <!-- 👉 State -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.state"
                label="State"
                placeholder="New York"
              />
            </VCol>

            <!-- 👉 Zip Code -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="billingAddress.zipCode"
                label="Zip Code"
                placeholder="123123"
                type="number"
              />
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
              >
                submit
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
