<template>
  <VCard
    title="Profile"
    class="mb-6"
  >
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Store name"
            placeholder="Pixinvent"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Phone"
            placeholder="+(123) 456-7890"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Store contact email"
            placeholder="johndoe@email.com"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Sender email"
            placeholder="johndoe@email.com"
          />
        </VCol>
        <VCol>
          <VAlert
            color="warning"
            variant="tonal"
          >
            <template #prepend>
              <VAvatar
                size="26"
                rounded
                color="#fff"
              >
                <VIcon
                  icon="tabler-bell"
                  size="18"
                  color="warning"
                  class="font-weight-medium"
                />
              </VAvatar>
            </template>
            Confirm that you have access to johndoe@gmail.com in sender email
            settings.
          </VAlert>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VCard
    title="Billing Information"
    class="mb-6"
  >
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Legal business name"
            placeholder="Pixinvent"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <AppSelect
            label="Country/Region"
            :items="['United States', 'Canada', 'UK']"
            placeholder="Canada"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            placeholder="126, New Street"
            label="Address"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Apartment,suit, etc."
            placeholder="Empire Heights"
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
            label="PIN Code"
            placeholder="111011"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VCard class="mb-6">
    <template #title>
      <div class="v-card-title text-wrap">
        Time zone and units of measurement
      </div>
    </template>

    <template #subtitle>
      <div class="text-wrap">
        Used to calculate product prices, shipping weights, and order times.
      </div>
    </template>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <AppSelect
            label="Time zone"
            :items="['(UTC-12:00) International Date Line West', '(UTC-11:00) Coordinated Universal Time-11', '(UTC-09:00) Alaska', '(UTC-08:00) Baja California']"
            placeholder="(UTC-12:00) International Date Line West"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <AppSelect
            label="Unit system"
            :items="['Metric System', 'Imperial', 'International System']"
            placeholder="Metric System"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <AppSelect
            label="Default weight unit"
            placeholder="Kilogram"
            :items="['Kilogram', 'Pounds', 'Gram']"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <VCard
    title="Store currency"
    subtitle="The currency your products are sold in."
    class="mb-6"
  >
    <VCardText>
      <AppSelect
        label="Store currency"
        :items="['USD', 'INR', 'Euro', 'Pound']"
        placeholder="USD"
      />
    </VCardText>
  </VCard>

  <VCard
    title="Order id format"
    subtitle="Shown on the Orders page, customer pages, and customer order notifications to identify orders."
    class="mb-6"
  >
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Prefix"
            prefix="#"
          />
        </VCol>

        <VCol
          cols="12"
          md="6"
        >
          <AppTextField
            label="Suffix"
            suffix="$"
          />
        </VCol>
      </VRow>

      <div class="mt-2">
        Your order ID will appear as #1001, #1002, #1003 ...
      </div>
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
