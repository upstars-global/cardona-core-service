<template>
  <div class="navbar-container d-flex content align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link class="nav-link" @click="toggleVerticalMenuActive">
          <feather-icon icon="MenuIcon" size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <dark-Toggler class="d-none d-lg-block" />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">{{ userName }}</p>
          </div>
          <b-avatar
            size="40"
            :text="userName[0].toUpperCase()"
            variant="light-success"
            badge
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <!-- <b-dropdown-item link-class="d-flex align-items-center">
          <feather-icon size="16" icon="UserIcon" class="mr-50" />
          <span>Profile</span>
        </b-dropdown-item> -->

        <!-- <b-dropdown-divider /> -->

        <template v-if="canAllAdminSection">
          <b-dropdown-item
            link-class="d-flex align-items-center"
            :to="{ name: 'UsersControlList' }"
          >
            <feather-icon size="16" icon="CommandIcon" class="mr-50" />
            <span> {{ $t('common.adminSection._') }}</span>
          </b-dropdown-item>

          <b-dropdown-divider />
        </template>

        <b-dropdown-item link-class="d-flex align-items-center" @click="onClickLogout">
          <feather-icon size="16" icon="LogOutIcon" class="mr-50" />
          <span>
            {{ $t('auth.logout') }}
          </span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink,
  BNavbarNav,
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
} from 'bootstrap-vue'
import DarkToggler from '../../@core/layouts/components/app-navbar/components/DarkToggler.vue'
import { getters, dispatch } from '../../store'

export default {
  name: 'AppNavbar',
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    // BDropdownDivider,
    BAvatar,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },

  computed: {
    userName() {
      return getters.userInfo?.userName || 'No name'
    },
    canAllAdminSection() {
      return getters.abilityCan('backoffice-users-control', 'view')
    },
  },

  methods: {
    onClickLogout() {
      dispatch('authCore/clearAuth')

      this.$router.push({ name: 'Login' })
    },
  },
}
</script>
