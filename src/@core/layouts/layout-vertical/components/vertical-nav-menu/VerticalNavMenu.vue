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
            <b-link v-else class="navbar-brand" to="/">
              <span class="brand-logo text-primary">
                {{ adminName }}
              </span>
            </b-link>
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

    <project-select v-if="isMenuTypeMain && isNeocore" class="mt-2" />

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

    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="
        (evt) => {
          shallShadowBottom = evt.srcElement.scrollTop > 0
        }
      "
    >
      <vertical-nav-menu-items :items="navMenuItems" class="navigation navigation-main" />
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import navMenuItems from '@/navigation/vertical'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { BLink } from 'bootstrap-vue'
import { provide, computed, ref } from 'vue'
import useAppConfig from '../../../../../@core/app-config/useAppConfig'
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue'
import useVerticalNavMenu from './useVerticalNavMenu'
import ProjectSelect from './components/ProjectSelect'
import { getters } from '../../../../../store'
import ProductsSelect from '../../../../../@core/layouts/layout-vertical/components/vertical-nav-menu/components/ProductsSelect'
import router from '../../../../../router'
import i18n from '../../../../../libs/i18n'

export default {
  name: 'VerticalNavMenu',
  components: {
    ProductsSelect,
    VuePerfectScrollbar,
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
    const isNeocore = computed(() => getters.isNeocore)

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
      isNeocore.value ? getters.selectedProject?.name : 'Alaro'
    )
    const goBack = () => {
      window.history.length > 2 ? router.go(-1) : router.push('/')
    }

    return {
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
    }
  },
}
</script>

<style lang="scss">
@import '../../../../../@core/scss/base/core/menu/menu-types/vertical-menu';
.main-menu {
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
      padding: 0rem;
    }
  }
}
</style>
