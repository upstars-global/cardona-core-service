<script setup lang="ts">
const isFullfilOnline = ref(true)
</script>

<template>
  <div>
    <VCard
      title="Location Name"
      class="mb-6"
    >
      <VCardText>
        <AppTextField
          label="Location Name"
          placeholder="Empire Hub"
        />
        <div class="my-4">
          <VCheckbox
            v-model="isFullfilOnline"
            disabled
            label="Fulfil online orders from this location"
          />
        </div>
        <VAlert
          color="info"
          closable
          variant="tonal"
        >
          <template #prepend>
            <VAvatar
              size="26"
              rounded
              color="#fff"
            >
              <VIcon
                icon="tabler-info-circle"
                size="18"
                color="primary"
              />
            </VAvatar>
          </template>
          This is your default location. To change whether you fulfill online orders from this location, select another default location first.
        </VAlert>
      </VCardText>
    </VCard>

    <VCard title="Address">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <AppSelect
              label="Country/religion"
              placeholder="Select Country"
              :items="['United States', 'UK', 'Canada']"
              model-value="United States"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="Address"
              placeholder="123 , New Street"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="Apartment, suite, etc."
              placeholder="Empire Heights"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="Phone"
              placeholder="+1 (234) 456-7890"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="City"
              placeholder="New York"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="State"
              placeholder="NY"
            />
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <AppTextField
              label="PIN code"
              placeholder="123897"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <div class="d-flex justify-end gap-x-4 mt-6">
      <VBtn
        variant="tonal"
        color="secondary"
      >
        Discard
      </VBtn>
      <VBtn>Save</VBtn>
    </div>
  </div>
</template>
