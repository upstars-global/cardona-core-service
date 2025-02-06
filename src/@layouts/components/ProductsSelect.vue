<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { productsName } from '../../configs/productsName'
import { IconsList } from '../../@model/enums/icons'

defineOptions({ name: 'ProductsSelect' })

const props = defineProps<{
  isCollapsedMenu: boolean
}>()

const store = useStore()

const selectedProduct = computed({
  get: () => store.getters.selectedProduct,
  set: val => {
    const url
      = val.name === productsName.neocore
        ? window.location.origin
        : `${window.location.origin}/${val.name}`

    window.location.replace(url)
  },
})

const products = computed(() => store.getters.userInfo.products)

const productNameSelected = computed(() =>
  props.isCollapsedMenu ? selectedProduct.value?.name : selectedProduct.value?.name.slice(0, 2),
)

const DYNAMIC_DOMAIN_PREFIX = ['cardona-bac-', 'cardona-development.boffice.site']

const isDynamicDomain = DYNAMIC_DOMAIN_PREFIX.some(parOfHost =>
  window.location.host.includes(parOfHost),
)

const canSelect = computed(() => products.value.length > 1)
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
        {{ selectedProduct.name }}
      </span>
    </RouterLink>
  </div>
</template>

<style lang="scss">
.product-select {

  .vs__dropdown-toggle {
    border: none !important;
    box-shadow: none !important;
    padding-left: 0;
    flex-wrap: nowrap;
  }
  .vs__actions {
    color: rgba(var(--v-theme-primary));
  }
  .vs__search {
    flex: 0 0 0;
    padding: 0;
    &:focus {
      padding: 0;
    }
  }
  .header-select {
    color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 0.5rem;
  }
  .select-item {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
  }
  .vs--single.vs--open .vs__selected {
    transform: translateX(0px);
    position: relative;
    opacity: 1;
  }
  .vs__selected-options {
    flex-basis: auto;
    flex-grow: initial;
    flex-wrap: nowrap;
  }
  .vs__dropdown-menu {
    top: calc(100% + 0.1rem);
    width: calc(100% + 40px);
    left: -10px;
    padding: 1rem;
    border: 1px solid rgba(var(--v-theme-grey-200));
    border-radius: 5px;

    .vs__dropdown-option {
      border-radius: 6px;
      padding: 0.5rem 0.5rem;
      &::after {
        opacity: 0;
      }
    }
  }
}
</style>
