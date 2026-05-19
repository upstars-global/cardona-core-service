<script setup lang="ts">
import { computed, watch } from 'vue'
import { upperFirst } from 'lodash'
import { productsName } from '../../../configs/productsName'
import { IconsList } from '../../../@model/enums/icons'
import { useUserStore } from '../../../stores/user'
import ApiService from '../../../services/api'
import { storageKeys } from '../../../configs/storage'

defineOptions({ name: 'ProductsSelect' })

defineProps<{
  isCollapsedMenu: boolean
}>()

const userStore = useUserStore()

const selectedProductName = computed(() => upperFirst(userStore.selectedProduct?.name))
const selectedProductNameShort = computed(() => selectedProductName.value.slice(0, 1))

const selectedProduct = computed({
  get: () => userStore.selectedProduct,
  set: val => {
    const url
      = val.name === productsName.neocore
        ? window.location.origin
        : `${window.location.origin}/${val.name}`

    sessionStorage.removeItem(storageKeys.selectedProjectId)
    window.location.replace(url)
  },
})

const products = computed(() => userStore.userInfo.products)

const canSelect = computed(() => products.value.length > 1)

watch(selectedProduct, product => {
  if (!product)
    return
  ApiService.setHeaders({
    productid: product?.id,
  })
}, {
  immediate: true,
})
</script>

<template>
  <div
    class="product-select d-flex align-center"
    :class="{ 'overflow-hidden': !canSelect }"
  >
    <template v-if="canSelect">
      <div class="select-item bg-info prodcut-short_size product-text d-flex align-center justify-center rounded">
        {{ selectedProductNameShort }}
      </div>
      <Transition name="product-select-fade">
        <VueSelect
          v-show="!isCollapsedMenu"
          v-model="selectedProduct"
          :options="products"
          label="name"
          class="select-text-color"
          :clearable="false"
          :searchable="false"
        >
          <template #list-header>
            <div class="products-dropdown-header">
              {{ $t('common.products._') }}
            </div>
          </template>
          <template #selected-option>
            <div class="d-flex align-center flex-nowrap">
              <span
                class="full-product-name select-item product-text"
              >{{ selectedProductName }}</span>
            </div>
          </template>
          <template #option="{ name }">
            <div class="products-dropdown-item d-flex align-center justify-space-between">
              <span>{{ name[0].toUpperCase() + name.slice(1) }}</span>
              <VIcon
                v-if="selectedProduct?.name === name"
                :icon="IconsList.CheckIcon"
                size="20"
                class="products-dropdown-check"
              />
            </div>
          </template>
          <template #open-indicator="{ attributes }">
            <VIcon
              class="chevron-icon"
              v-bind="attributes"
              :icon="IconsList.ChevronDownIcon"
            />
          </template>
        </VueSelect>
      </Transition>
    </template>
    <RouterLink
      v-else
      class="navbar-brand"
      to="/"
    >
      <span
        class="brand-logo select-item"
      >
        {{ selectedProduct?.name }}
      </span>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.full-product-name {
  font-size: 14px;
}

.product-select {
  position: relative;
  padding-left: 2rem;
}

.product-text {
  color: rgb(var(--v-theme-on-sidebar));
  font-weight: 600;
}

.prodcut-short_size {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2rem;
  width: 2rem;
  font-size: 13px;
}

.chevron-icon {
  color: rgba(var(--v-theme-on-sidebar), 0.7);
}

.product-select {
  .select-item {
    font-size: 13px;
    line-height: 20px;
    font-weight: 500;
  }
  :deep(.vs__dropdown-toggle) {
    border-color: transparent !important;
    box-shadow: none !important;
  }
}

.product-select-fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.product-select-fade-enter-active {
  transition: opacity 0.2s ease-in;
}
.product-select-fade-enter-from,
.product-select-fade-leave-to {
  opacity: 0;
}
</style>

<style lang="scss">
.product-select {
  .vs__dropdown-menu {
    background: rgb(var(--v-theme-sidebar)) !important;
    border: 1px solid rgba(var(--v-theme-on-sidebar), 0.16) !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 16px rgb(var(--v-theme-shadow)) !important;
    padding: 8px 0 !important;
    width: 220px !important;
    left: -32px !important;
  }

  .vs__dropdown-option {
    padding: 8px 16px !important;
    font-size: 15px !important;
    line-height: 22px !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
    background: transparent !important;
  }

  .vs__dropdown-option--selected::after {
    display: none !important;
  }

  .vs__dropdown-option:hover,
  .vs__dropdown-option--highlight {
    background: rgba(var(--v-theme-on-sidebar), 0.06) !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
  }

  .vs__dropdown-option--selected,
  .vs__dropdown-option--selected.vs__dropdown-option--highlight,
  .vs__dropdown-option--selected:hover {
    background: transparent !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
  }
}

.products-dropdown-header {
  padding: 0 8px 8px;
  font-size: 12px !important;
  line-height: 15px;
  letter-spacing: 0.4px;
  color: rgba(var(--v-theme-on-sidebar), 0.56) !important;
}

.products-dropdown-item {
  width: 100%;
}

.products-dropdown-check {
  color: rgb(var(--v-theme-on-sidebar));
  flex-shrink: 0;
}
</style>
