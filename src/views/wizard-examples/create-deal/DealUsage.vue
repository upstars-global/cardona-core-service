<script setup lang="ts">
import type { DealUsage } from './types'

const props = defineProps<{
  formData: DealUsage
}>()

const emit = defineEmits<{
  (e: 'update:formData', value: DealUsage): void
}>()

const formData = ref<DealUsage>(props.formData)

watch(formData, () => {
  emit('update:formData', formData.value)
})
</script>

<template>
  <VForm>
    <VRow>
      <VCol
        cols="12"
        sm="6"
      >
        <AppSelect
          v-model="formData.userType"
          label="User Type"
          placeholder="Select User Type"
          :items="['All', 'Registered', 'Unregistered', 'Prime Member']"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <AppTextField
          v-model="formData.maxUsers"
          label="Max Users"
          placeholder="1000"
          type="number"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <AppTextField
          v-model="formData.cartAmount"
          label="Minimum Cart Amount"
          placeholder="$199"
          type="number"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <AppTextField
          v-model="formData.promotionFree"
          label="Promotion Fee"
          placeholder="$4.99"
          type="number"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <AppSelect
          v-model="formData.paymentMethod"
          label="Payment Method"
          placeholder="Select Payment Method"
          :items="['Any', 'Credit Card', 'Net Banking', 'Wallet']"
        />
      </VCol>

      <VCol
        cols="12"
        sm="6"
      >
        <AppSelect
          v-model="formData.dealStatus"
          label="Deal Status"
          placeholder="Select Deal Status"
          :items="['Active', 'Inactive', 'Suspended', 'Abandoned']"
        />
      </VCol>

      <VCol cols="12">
        <VSwitch
          v-model="formData.isSingleUserCustomer"
          label="Limit this discount to a single-use per customer?"
        />
      </VCol>
    </VRow>
  </VForm>
</template>
