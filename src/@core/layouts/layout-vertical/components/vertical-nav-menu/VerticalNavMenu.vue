<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow"
    :class="menuClasses"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)"
  >
    <!-- main menu header-->
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggle-vertical-menu-active="toggleVerticalMenuActive"
        :toggle-collapsed="toggleCollapsed"
        :collapse-toggler-icon="collapseTogglerIcon"
      >
        <ul class="nav navbar-nav flex-row align-items-center justify-content-between flex-nowrap">
          <!-- Logo & Text -->
          <li class="nav-item mr-1 full-width">
            <products-select v-if="isMenuTypeMain" :is-collapsed-menu="isCollapsedMenu" />
            <div v-else class="navbar-brand cursor-pointer" @click="onClickOnBrandLogo">
              <span class="brand-logo text-primary">
                {{ adminName }}
              </span>
            </div>
          </li>

          <!-- Toggler Button -->
          <li class="nav-item nav-toggle">
            <b-link class="nav-link modern-nav-toggle">
              <feather-icon
                icon="XIcon"
                size="20"
                class="d-block d-xl-none"
                @click="toggleVerticalMenuActive"
              />
              <feather-icon
                :icon="collapseTogglerIconFeather"
                size="20"
                class="d-none d-xl-block collapse-toggle-icon"
                @click="toggleCollapsed"
              />
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->

    <!-- Shadow -->
    <div :class="{ 'd-block': shallShadowBottom }" class="shadow-bottom" />

    <project-select v-if="isMenuTypeMain && isNeocore" class="mt-2 project-select" />

    <div v-if="isMenuTypeMain" class="project-name">
      <span v-if="isCollapsedMenu">
        {{ selectedProjectTitle }}
      </span>

      <feather-icon v-else icon="MoreHorizontalIcon" size="18" />
    </div>

    <div v-if="isMenuTypeAdmin" class="cursor-pointer text-primary-hover" @click="goBack">
      <div
        class="d-flex align-items-center back-block-admin flex-nowrap"
        :class="{ 'justify-content-center no-collapsed': !isCollapsedMenu }"
      >
        <feather-icon icon="ArrowLeftIcon" size="18" :class="{ 'mr-1': isCollapsedMenu }" />
        <span v-if="isCollapsedMenu">{{ $t('common.back') }}</span>
      </div>
    </div>
    <div class="main-menu-content scroll-area" :style="maxHeight">
      <vertical-nav-menu-items :items="navMenuItems" class="navigation navigation-main" />
    </div>

    <div class="menu-footer">
      <slot
        name="footer"
        :toggle-vertical-menu-active="toggleVerticalMenuActive"
        :toggle-collapsed="toggleCollapsed"
        :collapse-toggler-icon="collapseTogglerIcon"
      />
    </div>
  </div>
</template>

<script>
import navMenuItems from '@/navigation/vertical'
import { BLink } from 'bootstrap-vue'
import { provide, computed, ref, watch } from 'vue'
import useAppConfig from '../../../../../@core/app-config/useAppConfig'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import useVerticalNavMenu from './useVerticalNavMenu'
import ProjectSelect from './components/ProjectSelect'
import store from '../../../../../store'
import ProductsSelect from '../../../../../@core/layouts/layout-vertical/components/vertical-nav-menu/components/ProductsSelect'
import { useRouter } from '../../../../../@core/utils/utils'
import i18n from '../../../../../libs/i18n'
import { convertUpperCaseFirstSymbol } from '../../../../../helpers'
import { useBlockHeight } from '../../../../../use/useBlockHeight'
export default {
  name: 'VerticalNavMenu',
  components: {
    ProductsSelect,
    VerticalNavMenuItems,
    ProjectSelect,
    BLink,
  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const { router, route } = useRouter()
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props)

    const { skin, isMenuTypeMain, isMenuTypeAdmin } = useAppConfig()

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false)

    provide('isMouseHovered', isMouseHovered)

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    }

    const collapseTogglerIconFeather = computed(() =>
      collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'
    )
    const isNeocore = computed(() => store.getters.isNeocore)

    const isCollapsedMenu = computed(
      () =>
        !isVerticalMenuCollapsed.value || (isVerticalMenuCollapsed.value && isMouseHovered.value)
    )

    const adminName = computed(() =>
      isCollapsedMenu.value
        ? i18n.t('common.adminSection.logoText')
        : i18n.t('common.adminSection.logoText').slice(0, 2)
    )

    const menuClasses = computed(() => {
      return [
        { expanded: isCollapsedMenu.value },
        skin.value === 'semi-dark' ? 'menu-dark' : 'menu-light',
      ]
    })
    const selectedProjectTitle = computed(() =>
      isNeocore.value
        ? store.getters.selectedProject?.publicName
        : convertUpperCaseFirstSymbol(store.getters.selectedProduct?.name)
    )

    const goBack = async () => {
      try {
        await router.push({ name: 'Dashboard' })
      } catch {}
    }

    const routeName = computed(() => route.value.name)

    const onClickOnBrandLogo = async () => {
      const pageName =
        routeName.value === 'UsersControlList' || routeName.value.includes('UsersControl')
          ? 'UsersControlList'
          : 'Dashboard'
      try {
        return await router.push({ name: pageName })
      } catch {}
    }

    const navbarHeader = useBlockHeight('.navbar-header')
    const projectSelect = useBlockHeight('.project-select')
    const projectName = useBlockHeight('.project-name')
    const footerMenu = useBlockHeight('.customer-menu-block > .customer-menu')

    const listBlocks = computed(() => [
      navbarHeader.value,
      projectSelect.value && projectSelect.value + 22, /// + margin
      projectName.value + 50, /// + padding
      footerMenu.value,
    ])

    const fixedHeightInMenu = computed(() => listBlocks.value.reduce((acc, curr) => acc + curr, 0))

    const maxHeight = computed(() => `max-height: calc(100% - ${fixedHeightInMenu.value}px);`)

    return {
      routeName,
      onClickOnBrandLogo,
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,
      selectedProjectTitle,
      menuClasses,
      isCollapsedMenu,
      goBack,

      // Shadow Bottom
      shallShadowBottom,

      // App Name
      isMenuTypeMain,
      isMenuTypeAdmin,
      isNeocore,
      adminName,

      maxHeight,
    }
  },
}
</script>

<style lang="scss">
@import '../../../../../@core/scss/base/core/menu/menu-types/vertical-menu';
@import '../../../../../assets/scss/mixins/scroll-mixin';

.dark-layout {
  @include scroll-bar-theme(#283046);
}

.main-menu {
  @include scroll-bar-theme(#f6f6f6);

  .main-menu-content {
    overflow-y: scroll;
    margin-bottom: 0.642rem;
  }
  .router-link-active {
    color: $body-color;
    &:hover {
      color: $primary;
    }
  }
  .back-block-admin {
    width: 100%;
    font-size: 1.143rem;
    padding: 0 2rem;
    margin-top: 2rem;

    &.no-collapsed {
      padding: 0;
    }
  }
  .navigation.navigation-main {
    li {
      &:not(.has-sub) {
        margin-right: 0px !important;
      }
      a {
        padding-right: 0px !important;
        margin-right: 0px !important;
        &:after {
          right: 0.5rem !important;
        }
      }
    }
  }
}
</style>
