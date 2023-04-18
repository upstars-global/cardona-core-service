<template>
  <div v-if="products.length > 1" class="product-select">
    <v-select
      v-if="isCollapsedMenu"
      v-model="selectedProduct"
      :dir="$store.getters['appConfigCore/dirOption']"
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
          <span class="select-item text-primary text-uppercase">{{ name }}</span>
        </div>
      </template>
      <template #option="{ name }">
        <div class="d-flex align-items-center flex-nowrap">
          <span>{{ name[0].toUpperCase() + name.slice(1) }}</span>
        </div>
      </template>
    </v-select>
    <div v-else class="select-item text-primary text-uppercase mt-50">
      {{ selectedProduct?.name.slice(0, 2) }}
    </div>
  </div>
  <b-link v-else class="navbar-brand" to="/">
    <span class="brand-logo text-primary">
      {{ productNameSelected }}
    </span>
  </b-link>
</template>

<script>
import { computed } from 'vue'
import { getters } from '../../../../../../store'

export default {
  name: 'ProductsSelect',
  props: {
    isCollapsedMenu: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const selectedProduct = computed({
      get: () => getters.selectedProduct,
      set: (val) => {
        if (val.name === 'alaro') {
          window.location.replace(`${window.location.origin}/alaro`)
        } else {
          window.location.replace(window.location.origin)
        }
      },
    })
    const products = computed(() => getters.userInfo.products)

    const productNameSelected = computed(() =>
      props.isCollapsedMenu ? selectedProduct.value?.name : selectedProduct.value?.name.slice(0, 2)
    )

    return {
      selectedProduct,
      products,
      productNameSelected,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../../../@core/scss/base/bootstrap-extended/include'; // Bootstrap includes
@import '../../../../../../@core/scss/base/components/include'; // Components includes

// Color palettes
@import '../../../../../../@core/scss/base/core/colors/palette-variables';
.dark-layout {
  .main-menu {
    .product-select {
      .vs__dropdown-toggle {
        background: $theme-dark-card-bg;
      }
    }
  }
}
.main-menu {
  .product-select {
    .vs__dropdown-toggle {
      border: none !important;
      box-shadow: none !important;
      padding-left: 0;
    }
    .vs__actions {
      color: $primary;
    }
    .header-select {
      color: $text-muted;
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
    }
    .vs__dropdown-menu {
      top: calc(100% + 0.1rem);
      width: calc(100% + 40px);
      left: -10px;
      padding: 1rem;
      border: 1px solid $border-color;
      border-radius: 5px;

      .vs__dropdown-option {
        border-radius: 6px;
        padding: 0.5rem 1rem;
        &::after {
          opacity: 0;
        }
      }
    }
  }
}
</style>
