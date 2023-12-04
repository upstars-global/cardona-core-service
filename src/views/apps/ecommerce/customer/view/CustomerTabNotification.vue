<script lang="ts" setup>
const notifications = ref([
  {
    type: 'Order status',
    email: true,
    browser: true,
    app: true,
  },
  {
    type: 'Upcoming sale',
    email: true,
    browser: true,
    app: true,
  },
  {
    type: 'Special offers',
    email: true,
    browser: true,
    app: false,
  },
  {
    type: 'New item arrival',
    email: true,
    browser: false,
    app: false,
  },
])
</script>

<template>
  <VCard class="user-tab-notification">
    <VCardItem>
      <VCardTitle class="mb-1">
        Recent Devices
      </VCardTitle>
      <VCardSubtitle>
        <div class="text-base text-high-emphasis">
          Change to notification settings, the user will get the update
        </div>
      </VCardSubtitle>
    </VCardItem>
    <VCardText>
      <VTable class="text-no-wrap border rounded recent-devices-table">
        <thead>
          <tr>
            <th scope="col">
              TYPE
            </th>
            <th scope="col">
              EMAIL
            </th>
            <th scope="col">
              BROWSER
            </th>
            <th scope="col">
              APP
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(notification, index) in notifications"
            :key="notification.type"
            :class="index % 2 === 0 ? 'table-colored-raw' : ''"
          >
            <td>{{ notification.type }}</td>
            <td>
              <VCheckbox v-model="notification.email" />
            </td>
            <td>
              <VCheckbox v-model="notification.browser" />
            </td>
            <td>
              <VCheckbox v-model="notification.app" />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>

    <VCardText class="d-flex flex-wrap gap-4">
      <VBtn>Save changes</VBtn>
      <VBtn
        color="secondary"
        variant="tonal"
      >
        Discard
      </VBtn>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.recent-devices-table{
  .table-colored-raw{
    background: rgba(var(--v-theme-on-surface), 0.02)
  }
}
</style>
