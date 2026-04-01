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

const DYNAMIC_DOMAIN_PREFIX = ['cardona-bac-', 'cardona-development.boffice.site']

const isDynamicDomain = DYNAMIC_DOMAIN_PREFIX.some(parOfHost =>
  window.location.host.includes(parOfHost),
)

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
                class="select-item product-text pl-3"
                :class="{ 'text-info': isDynamicDomain }"
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
        :class="{ 'text-info': isDynamicDomain }"
      >
        {{ selectedProduct?.name }}
      </span>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.product-select {
  position: relative;
  // Reserve space on the left so VueSelect never overlaps the badge.
  // Badge is position:absolute so it doesn't affect flex layout at all.
  padding-left: 2.5rem;
}

.product-text {
  color: rgb(var(--v-theme-on-sidebar));
  font-weight: 600;
}

.prodcut-short_size {
  // Taken out of flex flow — VueSelect changes can't affect badge position
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2rem;
  width: 2rem;
}

.chevron-icon {
  color: rgba(var(--v-theme-on-sidebar), 0.7);
}

// ── Dropdown menu ───────────────────────────────────────────────────────────
// Global vue-select.scss uses !important on highlight/selected — we must match.
// All overrides are under .product-select so scoped attribute makes them more specific.
.product-select {
  :deep(.vs__dropdown-toggle) {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  :deep(.vs__dropdown-menu) {
    background: rgb(var(--v-theme-sidebar)) !important;
    border: 1px solid rgba(var(--v-theme-on-sidebar), 0.16) !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 16px rgb(var(--v-theme-shadow)) !important;
    padding: 8px 0 !important;
    width: 220px !important;
    // Center dropdown relative to the trigger
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  :deep(.vs__dropdown-option) {
    padding: 8px 16px !important;
    font-size: 15px !important;
    line-height: 22px !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
    background: transparent !important;
  }

  // Global vue-select.scss adds ::after pseudo-element on --selected with content:''
  // which renders as an empty box — hide it since we use our own VIcon checkmark
  :deep(.vs__dropdown-option--selected::after) {
    display: none !important;
  }

  :deep(.vs__dropdown-option:hover),
  :deep(.vs__dropdown-option--highlight) {
    background: rgba(var(--v-theme-on-sidebar), 0.06) !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
  }

  // Selected state: transparent bg, white text, checkmark rendered by #option slot
  :deep(.vs__dropdown-option--selected),
  :deep(.vs__dropdown-option--selected.vs__dropdown-option--highlight),
  :deep(.vs__dropdown-option--selected:hover) {
    background: transparent !important;
    color: rgb(var(--v-theme-on-sidebar)) !important;
  }
}

// Section header "Products" — must be !important to beat any inherited color from vs__dropdown-menu
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

// Smooth fade when sidebar collapses / expands (synced with sidebar 0.25s transition)
.product-select-fade-leave-active {
  transition: opacity 0.15s ease-out;
}
.product-select-fade-enter-active {
  transition: opacity 0.2s ease-in;
  transition-delay: 0.1s; // wait for sidebar to start opening before fading in
}
.product-select-fade-enter-from,
.product-select-fade-leave-to {
  opacity: 0;
}
</style>
