<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'

import avatar1 from '@images/avatars/avatar-1.png'
import product21 from '@images/ecommerce-images/product-21.png'
import product22 from '@images/ecommerce-images/product-22.png'
import product23 from '@images/ecommerce-images/product-23.png'
import product24 from '@images/ecommerce-images/product-24.png'

const route = useRoute('apps-ecommerce-order-details-id')
const isConfirmDialogVisible = ref(false)
const isUserInfoEditDialogVisible = ref(false)
const isEditAddressDialogVisible = ref(false)

const headers = [
  { title: 'Product', key: 'productName' },
  { title: 'Price', key: 'price' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Total', key: 'total' },
]

const orderData = [
  {
    productName: 'OnePlus 7 Pro',
    productImage: product21,
    subtitle: 'Storage: 128gb',
    price: 799,
    quantity: 1,
    total: 799,
  },
  {
    productName: 'Face Cream',
    productImage: product22,
    subtitle: 'Gender: Women',
    price: 89,
    quantity: 1,
    total: 89,
  },
  {
    productName: 'Wooden Chair',
    productImage: product23,
    subtitle: 'Material: Woodem',
    price: 289,
    quantity: 2,
    total: 578,
  },
  {
    productName: 'Nike Jorden',
    productImage: product24,
    subtitle: 'Size: 8UK',
    price: 299,
    quantity: 2,
    total: 598,
  },
]
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <div class="d-flex gap-2 align-center mb-2 flex-wrap">
          <h4 class="text-h4">
            Order #{{ route.params.id }}
          </h4>
          <div class="d-flex gap-x-2">
            <VChip
              variant="tonal"
              color="success"
              label
            >
              Paid
            </VChip>
            <VChip
              variant="tonal"
              color="info"
              label
            >
              Ready to Pickup
            </VChip>
          </div>
        </div>
        <div>
          <span class="text-body-1">
            Aug 17, 2020, 5:48 (ET)
          </span>
        </div>
      </div>

      <VBtn
        variant="tonal"
        color="error"
        @click="isConfirmDialogVisible = !isConfirmDialogVisible"
      >
        Delete Order
      </VBtn>
    </div>

    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <!-- 👉 Order Details -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              <h5 class="text-h5">
                Order Details
              </h5>
            </template>
            <template #append>
              <VBtn variant="text">
                Edit
              </VBtn>
            </template>
          </VCardItem>

          <VDivider />
          <VDataTable
            :headers="headers"
            :items="orderData"
            item-value="productName"
            show-select
            class="text-no-wrap"
          >
            <template #item.productName="{ item }">
              <div class="d-flex gap-x-3">
                <VAvatar
                  size="38"
                  :image="item.productImage"
                  :rounded="0"
                />

                <div class="d-flex flex-column align-start">
                  <span class="text-body-1 font-weight-medium">
                    {{ item.productName }}
                  </span>

                  <span class="text-sm text-disabled">
                    {{ item.subtitle }}
                  </span>
                </div>
              </div>
            </template>

            <template #item.price="{ item }">
              <span>${{ item.price }}</span>
            </template>

            <template #item.total="{ item }">
              <span class="text-h6 ">
                ${{ item.total }}
              </span>
            </template>

            <template #item.quantity="{ item }">
              <span class="text-high-emphasis font-weight-medium">{{ item.quantity }}</span>
            </template>

            <template #bottom />
          </VDataTable>
          <VDivider />

          <VCardText>
            <div class="d-flex align-end flex-column">
              <table class="text-high-emphasis">
                <tbody>
                  <tr>
                    <td width="200px">
                      Subtotal:
                    </td>
                    <td>
                      $2,093
                    </td>
                  </tr>
                  <tr>
                    <td>Shipping Total: </td>
                    <td>
                      $2
                    </td>
                  </tr>
                  <tr>
                    <td>Tax: </td>
                    <td>
                      $28
                    </td>
                  </tr>
                  <tr>
                    <td class="text-high-emphasis font-weight-medium">
                      Total:
                    </td>
                    <td class="font-weight-medium">
                      $2,113
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Shipping Activity -->
        <VCard title="Shipping Activity">
          <VCardText>
            <VTimeline
              truncate-line="both"
              align="start"
              side="end"
              line-color="primary"
              density="compact"
              class="v-timeline-density-compact"
            >
              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div class="app-timeline-title">
                    Order was placed (Order ID: #32543)
                  </div>
                  <div class="app-timeline-meta">
                    Tuesday 10:20 AM
                  </div>
                </div>
                <p class="app-timeline-text mb-0">
                  Your order has been placed successfully
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Pick-up</span>
                  <span class="app-timeline-meta">Wednesday 11:29 AM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Pick-up scheduled with courier
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Dispatched</span>
                  <span class="app-timeline-meta">Thursday 8:15 AM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Item has been picked up by courier.
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Package arrived</span>
                  <span class="app-timeline-meta">Saturday 15:20 AM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Package arrived at an Amazon facility, NY
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Dispatched for delivery</span>
                  <span class="app-timeline-meta">Today 14:12 PM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Package has left an Amazon facility , NY
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="secondary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Delivery</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Package will be delivered by tomorrow
                </p>
              </VTimelineItem>
            </VTimeline>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <!-- 👉 Customer Details  -->
        <VCard class="mb-6">
          <VCardText class="d-flex flex-column gap-y-6">
            <div class="text-body-1 text-high-emphasis font-weight-medium">
              Customer Details
            </div>

            <div class="d-flex align-center">
              <VAvatar
                :image="avatar1"
                class="me-3"
              />
              <div>
                <div class="text-body-1 font-weight-medium">
                  Shamus Tuttle
                </div>
                <span class="text-sm text-disabled">Customer ID: #47389</span>
              </div>
            </div>

            <div>
              <VAvatar
                variant="tonal"
                color="success"
                class="me-3"
              >
                <VIcon icon="tabler-shopping-cart" />
              </VAvatar>
              <span class="text-body-1 font-weight-medium text-high-emphasis">12 Orders</span>
            </div>

            <div class="d-flex flex-column gap-y-1">
              <div class="d-flex justify-space-between align-center text-body-2">
                <span class="text-body-1 text-high-emphasis font-weight-medium">Contact Info</span>
                <VBtn
                  variant="text"
                  density="compact"
                  @click="isUserInfoEditDialogVisible = !isUserInfoEditDialogVisible"
                >
                  Edit
                </VBtn>
              </div>
              <span>Email: Sheldon88@yahoo.com</span>
              <span>Mobile: +1 (609) 972-22-22</span>
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Shipping Address -->
        <VCard class="mb-6">
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div class="text-body-1 text-high-emphasis font-weight-medium">
                Shipping Address
              </div>
              <VBtn
                variant="text"
                density="compact"
                @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
              >
                Edit
              </VBtn>
            </div>
            <div>
              45 Rocker Terrace <br> Latheronwheel <br> KW5 8NW, London <br> UK
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Billing Address -->
        <VCard>
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div class="text-body-1 text-high-emphasis font-weight-medium">
                Billing Address
              </div>
              <VBtn
                variant="text"
                density="compact"
                @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
              >
                Edit
              </VBtn>
            </div>
            <div>
              45 Rocker Terrace <br> Latheronwheel <br> KW5 8NW, London <br> UK
            </div>

            <div class="mt-6">
              <div class="text-body-1 text-body-1 text-high-emphasis font-weight-medium">
                Mastercard
              </div>
              <div class="text-body-1">
                Card Number: ******4291
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure to cancel your Order?"
      cancel-msg="Order cancelled!!"
      cancel-title="Cancelled"
      confirm-msg="Your order cancelled successfully."
      confirm-title="Cancelled!"
    />

    <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" />

    <AddEditAddressDialog v-model:isDialogVisible="isEditAddressDialogVisible" />
  </div>
</template>
