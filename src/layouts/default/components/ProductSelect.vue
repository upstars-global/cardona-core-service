<script setup lang="ts">
import { computed, watch } from 'vue'

import { productsName } from '../../configs/productsName'
import { IconsList } from '../../@model/enums/icons'
import { useUserStore } from '../../stores/user'
import ApiService from '../../services/api'
import { storageKeys } from '../../configs/storage'

defineOptions({ name: 'ProductsSelect' })

const props = defineProps<{
  isCollapsedMenu: boolean
}>()

const userStore = useUserStore()

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
    class="product-select"
    :class="{ 'overflow-hidden': !canSelect }"
  >
    <template v-if="canSelect">
      <div
        v-if="isCollapsedMenu"
        class="select-item text-primary text-uppercase py-2"
      >
        {{ selectedProduct?.name.slice(0, 2) }}
      </div>
      <VueSelect
        v-else
        v-model="selectedProduct"
        :options="products"
        label="name"
        :clearable="false"
        :searchable="false"
      >
        <template #list-header>
          <div class="text-uppercase header-select">
            {{ $t('common.products._') }}
          </div>
        </template>
        <template #selected-option="{ name }">
          <div class="d-flex align-items-center flex-nowrap">
            <span
              class="select-item text-primary text-uppercase"
              :class="{ 'text-info': isDynamicDomain }"
            >{{ name }}</span>
          </div>
        </template>
        <template #option="{ name }">
          <div class="d-flex align-items-center flex-nowrap">
            <span>{{ name[0].toUpperCase() + name.slice(1) }}</span>
          </div>
        </template>
        <template #open-indicator="{ attributes }">
          <VIcon
            class="text-primary"
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
        class="brand-logo text-primary select-item text-uppercase"
        :class="{ 'text-info': isDynamicDomain }"
      >
        {{ selectedProduct?.name }}
      </span>
    </RouterLink>
  </div>
</template>
