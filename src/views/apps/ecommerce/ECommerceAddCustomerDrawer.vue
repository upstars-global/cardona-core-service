<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'

interface Props {
  isDrawerOpen: boolean
}

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}

const refVForm = ref<VForm>()
const name = ref()
const email = ref()
const mobile = ref()
const addressline1 = ref()
const addressline2 = ref()
const town = ref()
const state = ref()
const postCode = ref()
const country = ref()
const isBillingAddress = ref(false)

const resetForm = () => {
  refVForm.value?.reset()
  emit('update:isDrawerOpen', false)
}
</script>

<template>
  <VNavigationDrawer
    :model-value="props.isDrawerOpen"
    temporary
    location="end"
    width="370"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      title="Add a Customer"
      @cancel="$emit('update:isDrawerOpen', false)"
    />

    <VDivider />

    <VCard flat>
      <PerfectScrollbar
        :options="{ wheelPropagation: false }"
        class="h-100"
      >
        <VCardText style="block-size: calc(100vh - 5rem);">
          <VForm
            ref="refVForm"
            @submit.prevent=""
          >
            <VRow>
              <VCol>
                <div class="text-body-1 font-weight-medium text-high-emphasis">
                  Basic Information
                </div>
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="name"
                  label="Name*"
                  :rules="[requiredValidator]"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email*"
                  :rules="[requiredValidator, emailValidator]"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="mobile"
                  label="mobile*"
                  :rules="[requiredValidator]"
                  placeholder="+(123) 456-7890"
                />
              </VCol>

              <VCol>
                <div class="text-body-1 font-weight-medium text-high-emphasis">
                  Shipping Information
                </div>
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="addressline1"
                  label="Address Line 1*"
                  :rules="[requiredValidator]"
                  placeholder="45, Rocker Terrace"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="addressline2"
                  placeholder="Empire Heights,"
                  :rules="[requiredValidator]"
                  label="Address Line 2*"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="town"
                  label="Town*"
                  :rules="[requiredValidator]"
                  placeholder="New York"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="state"
                  placeholder="Texas"
                  :rules="[requiredValidator]"
                  label="State/Province*"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="postCode"
                  label="Post Code*"
                  type="number"
                  :rules="[requiredValidator]"
                  placeholder="982347"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="country"
                  placeholder="United States"
                  :rules="[requiredValidator]"
                  label="Country"
                  :items="['United States', 'United Kingdom', 'Canada']"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column gap-y-1">
                    <div class="text-body-2 font-weight-medium text-high-emphasis">
                      Use as a billing address?
                    </div>
                    <span>Please check budget for more info</span>
                  </div>
                  <VSwitch v-model="isBillingAddress" />
                </div>
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-start">
                  <VBtn
                    type="submit"
                    color="primary"
                    class="me-4"
                  >
                    Add
                  </VBtn>
                  <VBtn
                    color="error"
                    variant="tonal"
                    @click="resetForm"
                  >
                    Discard
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </PerfectScrollbar>
    </VCard>
  </VNavigationDrawer>
</template>

<style lang="scss">
.v-navigation-drawer__content {
  overflow-y: hidden !important;
}
</style>
