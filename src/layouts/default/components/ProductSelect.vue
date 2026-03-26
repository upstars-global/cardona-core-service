<script setup lang="ts">
import { computed, watch } from 'vue'
import {upperFirst} from 'lodash'
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
    class="product-select d-flex align-center justify-between"
    :class="{ 'overflow-hidden': !canSelect }"
  >
    <template v-if="canSelect">
      <div
        class="select-item bg-info prodcut-short_size product-text d-flex align-center justify-center rounded"
      >
        {{ selectedProductNameShort }}
      </div>
      <VueSelect
        v-if="!isCollapsedMenu"
        v-model="selectedProduct"
        :options="products"
        label="name"
        class="select-text-color"
        :clearable="false"
        :searchable="false"
      >
        <template #list-header>
          <div >
            {{ $t('common.products._') }}
          </div>
        </template>
        <template #selected-option="{ name }">
          <div class="d-flex align-center flex-nowrap">
            <span
              class="select-item product-text ml-3"
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
.product-text {
  color: rgb(var(--v-theme-on-sidebar));
  font-weight: 600;
}

.prodcut-short_size {
  height: 2rem;
  width: 2rem;
}

.chevron-icon {
  color: rgba(var(--v-theme-on-sidebar), 0.7);
}
</style>
