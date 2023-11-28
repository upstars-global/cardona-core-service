<script setup lang="ts">
const customerNotifications = ref([
  {
    type: 'New customer sign up',
    email: true,
    app: true,
  },
  {
    type: 'Customer account password reset',
    email: true,
    app: true,
  },
  {
    type: 'Customer account invite',
    email: false,
    app: false,
  },

])

const shippingNotifications = ref([
  {
    type: 'Picked up',
    email: true,
    app: true,
  },
  {
    type: 'Shipping update ',
    email: true,
    app: false,
  },
  {
    type: 'Delivered',
    email: false,
    app: true,
  },

])

const ordersNotification = ref([
  {
    type: 'Order purchase',
    email: true,
    app: true,
  },
  {
    type: 'Order cancelled',
    email: true,
    app: false,
  },
  {
    type: 'Order refund request',
    email: false,
    app: true,
  },
  {
    type: 'Order confirmation',
    email: true,
    app: false,
  },
  {
    type: 'Payment error',
    email: true,
    app: false,
  },

])
</script>

<template>
  <VCard class="mb-4">
    <VCardText>
      <h5 class="text-h5 mb-2">
        Customer
      </h5>
      <VTable class="text-no-wrap mb-6 border rounded">
        <thead>
          <tr>
            <th scope="col">
              TYPE
            </th>
            <th scope="col">
              EMAIL
            </th>
            <th scope="col">
              APP
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="notification in customerNotifications"
            :key="notification.type"
          >
            <td width="400px">
              {{ notification.type }}
            </td>
            <td>
              <VCheckbox v-model="notification.email" />
            </td>

            <td>
              <VCheckbox v-model="notification.app" />
            </td>
          </tr>
        </tbody>
      </VTable>

      <h5 class="text-h5 mb-2">
        Orders
      </h5>
      <VTable class="text-no-wrap mb-6 border rounded">
        <thead>
          <tr>
            <th scope="col">
              TYPE
            </th>
            <th scope="col">
              EMAIL
            </th>
            <th scope="col">
              APP
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="notification in ordersNotification"
            :key="notification.type"
          >
            <td width="400px">
              {{ notification.type }}
            </td>
            <td>
              <VCheckbox v-model="notification.email" />
            </td>

            <td>
              <VCheckbox v-model="notification.app" />
            </td>
          </tr>
        </tbody>
      </VTable>

      <h5 class="text-h5 mb-2">
        Shipping
      </h5>
      <VTable class="text-no-wrap mb-6 border rounded">
        <thead>
          <tr>
            <th scope="col">
              TYPE
            </th>
            <th scope="col">
              EMAIL
            </th>
            <th scope="col">
              APP
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="notification in shippingNotifications"
            :key="notification.type"
          >
            <td width="400px">
              {{ notification.type }}
            </td>
            <td>
              <VCheckbox v-model="notification.email" />
            </td>

            <td>
              <VCheckbox v-model="notification.app" />
            </td>
          </tr>
        </tbody>
      </VTable>
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

<style lang="scss" scoped>
.v-table{
  tr:nth-child(even){
    background: rgba(var(--v-theme-on-surface), 2%)
  }
}
</style>
