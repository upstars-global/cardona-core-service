<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';

interface UserData {
  id: number | null
  fullName: string
  company: string
  username: string
  role: string
  country: string
  contact: string
  email: string
  currentPlan: string
  status: string
  avatar: string
  taskDone: number | null
  projectDone: number | null
  taxId: string
  language: string
}

interface Props {
  userData?: UserData
  isDialogVisible: boolean
}

interface Emit {
  (e: 'submit', value: UserData): void
  (e: 'update:isDialogVisible', val: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  userData: () => ({
    id: 0,
    fullName: '',
    company: '',
    role: '',
    username: '',
    country: '',
    contact: '',
    email: '',
    currentPlan: '',
    status: '',
    avatar: '',
    taskDone: null,
    projectDone: null,
    taxId: '',
    language: '',
  }),
})

const emit = defineEmits<Emit>()

const userData = ref<UserData>(structuredClone(toRaw(props.userData)))
const isUseAsBillingAddress = ref(false)

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', userData.value)
}

const onFormReset = () => {
  userData.value = structuredClone(toRaw(props.userData))

  emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 677"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-8 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3">
          Edit User Information
        </VCardTitle>
        <p class="mb-0">
          Updating user details will receive a privacy audit.
        </p>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 First Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.fullName"
                label="Full Name"
                placeholder="John Doe"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.username"
                label="Username"
                placeholder="johndoe"
              />
            </VCol>

            <!-- 👉 Billing Email -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.email"
                label="Billing Email"
                placeholder="johndoe@email.com"
              />
            </VCol>

            <!-- 👉 Status -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.status"
                label="Status"
                placeholder="Active"
              />
            </VCol>

            <!-- 👉 Tax Id -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.taxId"
                label="Tax Id"
                placeholder="123456789"
              />
            </VCol>

            <!-- 👉 Contact -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.contact"
                label="Contact"
                placeholder="+1 9876543210"
              />
            </VCol>

            <!-- 👉 Language -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.language"
                chips
                multiple
                label="Language"
                placeholder="English"
              />
            </VCol>

            <!-- 👉 Country -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                v-model="userData.country"
                label="Country"
                placeholder="United States"
              />
            </VCol>

            <!-- 👉 Switch -->
            <VCol cols="12">
              <VSwitch
                v-model="isUseAsBillingAddress"
                density="compact"
                label="Use as a billing address?"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit">
                Submit
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="onFormReset"
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
