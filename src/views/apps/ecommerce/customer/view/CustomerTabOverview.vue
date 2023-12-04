<script setup lang="ts">
import CustomerOrderTable from './CustomerOrderTable.vue'
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-2 flex-column">
          <VAvatar
            variant="tonal"
            color="primary"
            icon="tabler-currency-dollar"
            rounded
          />
          <h4 class="text-h4">
            Account Balance
          </h4>
          <div>
            <span class="text-primary text-h4 me-2">$2345</span>
            <span class="text-body-1">Credit Left</span>
            <p class="mb-0 text-base text-disabled">
              Account balance for next purchase
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-2 flex-column">
          <VAvatar
            variant="tonal"
            color="success"
            icon="tabler-gift-card"
            rounded
          />
          <h4 class="text-h4">
            Loyalty Program
          </h4>
          <div>
            <VChip
              color="success"
              class="mb-2"
              label
            >
              Platinum Member
            </VChip>
            <p class="mb-0 text-base text-disabled">
              3000 points to next tier
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-2 flex-column">
          <VAvatar
            variant="tonal"
            color="warning"
            icon="tabler-star"
            rounded
          />
          <h4 class="text-h4">
            Wishlist
          </h4>
          <div>
            <p class="mb-1">
              <span class="text-warning text-h5 me-2">15</span>
              <span class="text-body-1">items in wishlist</span>
            </p>
            <p class="mb-0 text-disabled">
              Receive notification when items go on sale
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-1 flex-column">
          <VAvatar
            variant="tonal"
            color="info"
            icon="tabler-discount-2"
            rounded
          />
          <h4 class="text-h4 mb-2">
            Coupons
          </h4>
          <div>
            <p class="mb-1">
              <span class="text-info text-h5 me-2">21</span>
              <span class="text-body-1">Coupons you win</span>
            </p>
            <p class="mb-0 text-disabled">
              Use coupon on next purchase
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol>
      <CustomerOrderTable />
    </VCol>
  </VRow>
</template>
