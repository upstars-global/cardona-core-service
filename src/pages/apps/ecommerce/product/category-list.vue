<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import ECommerceAddCategoryDrawer from '@/views/apps/ecommerce/EcommerceAddCategoryDrawer.vue'

import product1 from '@images/ecommerce-images/product-1.png'
import product10 from '@images/ecommerce-images/product-10.png'
import product11 from '@images/ecommerce-images/product-11.png'
import product12 from '@images/ecommerce-images/product-12.png'
import product14 from '@images/ecommerce-images/product-14.png'
import product17 from '@images/ecommerce-images/product-17.png'
import product19 from '@images/ecommerce-images/product-19.png'
import product2 from '@images/ecommerce-images/product-2.png'
import product25 from '@images/ecommerce-images/product-25.png'
import product28 from '@images/ecommerce-images/product-28.png'
import product9 from '@images/ecommerce-images/product-9.png'

const categoryData = ref([
  {
    id: 1,
    categoryTitle: 'Smart Phone',
    description: 'Choose from wide range of smartphones online at best prices.',
    totalProduct: 12548,
    totalEarning: 98784,
    image: product1,
  },
  {
    id: 2,
    categoryTitle: 'Clothing, Shoes, and jewellery',
    description: 'Fashion for a wide selection of clothing, shoes, jewellery and watches.',
    totalProduct: 4689,
    totalEarning: 45627,
    image: product9,
  },
  {
    id: 3,
    categoryTitle: 'Home and Kitchen',
    description: 'Browse through the wide range of Home and kitchen products.',
    totalProduct: 12548,
    totalEarning: 98784,
    image: product10,
  },
  {
    id: 4,
    categoryTitle: 'Beauty and Personal Care',
    description: 'Explore beauty and personal care products, shop makeup and etc.',
    totalProduct: 12548,
    totalEarning: 98784,
    image: product19,
  },
  {
    id: 5,
    categoryTitle: 'Books',
    description: 'Over 25 million titles across categories such as business  and etc.',
    totalProduct: 12548,
    totalEarning: 98784,
    image: product25,
  },
  {
    id: 6,
    categoryTitle: 'Games',
    description: 'Every month, get exclusive in-game loot, free games, a free subscription.',
    totalProduct: 12548,
    totalEarning: 98784,
    image: product12,
  },
  {
    id: 7,
    categoryTitle: 'Baby Products',
    description: 'Buy baby products across different categories from top brands.',
    totalProduct: 12548,
    totalEarning: 98784,
    image: product14,
  },
  {
    id: 8,
    categoryTitle: 'Growsari',
    description: 'Shop grocery Items through at best prices in India.',
    totalProduct: 12548,
    totalEarning: 98784,
    image: product28,
  },
  {
    id: 9,
    categoryTitle: 'Computer Accessories',
    description: 'Enhance your computing experience with our range of computer accessories.',
    totalProduct: 9876,
    totalEarning: 65421,
    image: product17,
  },
  {
    id: 10,
    categoryTitle: 'Fitness Tracker',
    description: 'Monitor your health and fitness goals with our range of advanced fitness trackers.',
    totalProduct: 1987,
    totalEarning: 32067,
    image: product10,
  },
  {
    id: 11,
    categoryTitle: 'Smart Home Devices',
    description: 'Transform your home into a smart home with our innovative smart home devices.',
    totalProduct: 2345,
    totalEarning: 87654,
    image: product11,
  },
  {
    id: 12,
    categoryTitle: 'Audio Speakers',
    description: 'Immerse yourself in rich audio quality with our wide range of speakers.',
    totalProduct: 5678,
    totalEarning: 32145,
    image: product2,
  },

])

const headers = [
  { title: 'Category', key: 'categoryTitle' },
  { title: 'Total Products', key: 'totalProduct' },
  { title: 'Total Earning', key: 'totalEarning' },
  { title: 'Action', key: 'actions', sortable: false },
]

const deleteCategory = (id: number) => {
  const categoryIndex = categoryData.value.findIndex(category => category.id === id)

  categoryData.value.splice(categoryIndex, 1)
}

const itemsPerPage = ref(10)
const page = ref(1)
const searchQuery = ref('')
const isAddProductDrawerOpen = ref(false)
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <div class="d-flex justify-sm-space-between flex-wrap gap-y-4 gap-x-6 justify-start">
          <VTextField
            v-model="searchQuery"
            placeholder="Search"
            density="compact"
            style="max-inline-size: 200px; min-inline-size: 200px;"
          />

          <div class="d-flex align-center flex-wrap gap-4">
            <AppSelect
              v-model="itemsPerPage"
              :items="[5, 10, 15]"
            />
            <VBtn
              prepend-icon="tabler-plus"
              @click="isAddProductDrawerOpen = !isAddProductDrawerOpen"
            >
              Add Category
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />

      <div class="category-table">
        <VDataTable
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :headers="headers"
          :items="categoryData"
          item-value="categoryTitle"
          :search="searchQuery"
          show-select
          class="text-no-wrap"
        >
          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon
                icon="tabler-trash"
                @click="deleteCategory(item.id)"
              />
            </IconBtn>
            <IconBtn>
              <VIcon icon="tabler-edit" />
            </IconBtn>
          </template>
          <template #item.categoryTitle="{ item }">
            <div class="d-flex gap-x-3">
              <VAvatar
                variant="tonal"
                rounded
                size="38"
              >
                <img
                  :src="item.image"
                  :alt="item.categoryTitle"
                  width="38"
                  height="38"
                >
              </VAvatar>
              <div>
                <h6 class="text-h6">
                  {{ item.categoryTitle }}
                </h6>
                <div class="text-sm text-disabled">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </template>
          <template #item.totalEarning="{ item }">
            <h6 class="text-h6 text-end pe-4">
              {{ (item.totalEarning).toLocaleString("en-IN", { style: "currency", currency: 'USD' }) }}
            </h6>
          </template>
          <template #item.totalProduct="{ item }">
            <div class="text-end pe-4">
              {{ (item.totalProduct).toLocaleString() }}
            </div>
          </template>
          <template #bottom>
            <VDivider />
            <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
              <p class="text-sm text-medium-emphasis mb-0">
                showing {{ itemsPerPage * (page - 1) + 1 }} to
                {{ Math.min(itemsPerPage * page, categoryData.length) }} of {{ categoryData.length }} entries
              </p>
              <VPagination
                v-model="page"
                :length="Math.ceil(categoryData.length / itemsPerPage)"
                :total-visible="5"
              >
                <template #prev="slotProps">
                  <VBtn
                    variant="tonal"
                    color="default"
                    v-bind="slotProps"
                    :icon="false"
                  >
                    Previous
                  </VBtn>
                </template>
                <template #next="slotProps">
                  <VBtn
                    variant="tonal"
                    color="default"
                    v-bind="slotProps"
                    :icon="false"
                  >
                    Next
                  </VBtn>
                </template>
              </VPagination>
            </div>
          </template>
        </VDataTable>
      </div>
    </VCard>

    <ECommerceAddCategoryDrawer v-model:isDrawerOpen="isAddProductDrawerOpen" />
  </div>
</template>

<style lang="scss">
.ProseMirror-focused{
  border: none;
}

.category-table{
  .v-table {
    th:nth-child(3), th:nth-child(4) {
      .v-data-table-header__content{
        justify-content: end ;
      }
    }
  }
}
</style>
