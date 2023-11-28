<script setup lang="ts">
const contactMethod = ref('Phone number')
const fullName = ref('Only require last name')
const companyName = ref('Don\'t include')
const addressLine = ref('Optional')
const shippingAddress = ref('Optional')
</script>

<template>
  <VCard
    title="Customer contact method"
    subtitle="Select what contact method customers use to check out."
    class="mb-6"
  >
    <VCardText>
      <VRadioGroup
        v-model="contactMethod"
        class="mb-4"
      >
        <VRadio
          label="Phone number"
          value="Phone number"
        />
        <VRadio
          label="Email"
          value="Email"
        />
      </VRadioGroup>

      <VAlert
        color="info"
        variant="tonal"
      >
        <template #prepend>
          <VAvatar
            size="28"
            rounded
            color="#fff"
          >
            <VIcon
              icon="tabler-alert-circle"
              size="18"
              color="warning"
            />
          </VAvatar>
        </template>
        To send SMS updates, you need to install an SMS App.
      </VAlert>
    </VCardText>
  </VCard>

  <VCard
    title="Customer information"
    class="mb-6"
  >
    <VCardText class="customer-info-card">
      <VRadioGroup
        v-model="fullName"
        label="Full name"
        class="mb-4"
      >
        <VRadio
          value="Only require last name"
          label="Only require last name"
        />
        <VRadio
          value="Require first and last name"
          label="Require first and last name"
        />
      </VRadioGroup>

      <VRadioGroup
        v-model="companyName"
        label="Company name"
        class="mb-4"
      >
        <VRadio
          value="Don't include"
          label="Don't include"
        />
        <VRadio
          value="Optional"
          label="Optional"
        />
        <VRadio
          value="Required"
          label="Required"
        />
      </VRadioGroup>

      <VRadioGroup
        v-model="addressLine"
        label="Address line 2 (apartment, unit, etc.)"
        class="mb-4"
      >
        <VRadio
          value="Don't include"
          label="Don't include"
        />
        <VRadio
          value="Optional"
          label="Optional"
        />
        <VRadio
          value="Required"
          label="Required"
        />
      </VRadioGroup>

      <VRadioGroup
        v-model="shippingAddress"
        label="Shipping address phone number"
        class="mb-4"
      >
        <VRadio
          value="Don't include"
          label="Don't include"
        />
        <VRadio
          value="Optional"
          label="Optional"
        />
        <VRadio
          value="Required"
          label="Required"
        />
      </VRadioGroup>
    </VCardText>
  </VCard>

  <div class="d-flex justify-end gap-x-4">
    <VBtn
      variant="tonal"
      color="secondary"
    >
      Discard
    </VBtn>
    <VBtn>Save</VBtn>
  </div>
</template>

<style lang="scss">
.customer-info-card{
  .v-radio-group{
    .v-input__control{
      .v-label{
        margin-inline-start: 0;
      }
    }
  }
}
</style>
