<script setup lang="ts">
import { computed, watch } from 'vue'
import { upperFirst } from 'lodash'
import { productsName } from '../../../configs/productsName'
import { IconsList } from '../../../@model/enums/icons'
import { useUserStore } from '../../../stores/user'
import ApiService from '../../../services/api'
import { storageKeys } from '../../../configs/storage'

defineOptions({ name: 'ProductsSelect' })

const props = defineProps<{
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

const productNameSelected = computed(() =>
  props.isCollapsedMenu ? selectedProduct.value?.name : selectedProduct.value?.name.slice(0, 2),
)

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
            <div>
              {{ $t('common.products._') }}
            </div>
          </template>
          <template #selected-option="{ name }">
            <div class="d-flex align-center flex-nowrap">
              <span
                class="select-item product-text pl-3"
                :class="{ 'text-info': isDynamicDomain }"
              >{{ selectedProductName }}</span>
            </div>
          </template>
          <template #option="{ name }">
            <div class="d-flex align-items-center flex-nowrap">
              <span>{{ name[0].toUpperCase() + name.slice(1) }}</span>
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
        class="brand-logo  select-item"
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
