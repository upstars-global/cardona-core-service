<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppsAndPages } from '@/navigation/vertical/apps-and-pages'

const { t } = useI18n()
const { appsAndPages } = useAppsAndPages()
const navItems = computed(() => appsAndPages.value)

const drawer = ref(true)
const isFallbackStateActive = ref(false)
</script>

<template>
  <VLayout class="custom-layout">
    <VAppBar
      elevation="1"
      height="64"
    >
      <template #prepend>
        <VAppBarNavIcon @click="drawer = !drawer" />
      </template>

      <VAppBarTitle>My App</VAppBarTitle>

      <template #append>
        <VBtn
          icon
          variant="text"
        >
          <VIcon icon="tabler-bell" />
        </VBtn>
        <VBtn
          icon
          variant="text"
        >
          <VIcon icon="tabler-user" />
        </VBtn>
      </template>
    </VAppBar>

    <VNavigationDrawer
      v-model="drawer"
      width="260"
    >
      <div class="px-4 py-5 d-flex align-center gap-2">
        <VIcon
          icon="tabler-box"
          size="28"
          color="primary"
        />
        <span class="text-h6 font-weight-bold">Cardona</span>
      </div>

      <VDivider />

      <VList
        nav
        class="py-3"
      >
        <VListItem
          v-for="item in navItems"
          :key="item.title"
          :prepend-icon="item.icon?.icon"
          :title="t(item.title)"
          :to="item.to"
          rounded="lg"
          active-color="primary"
        />
      </VList>
    </VNavigationDrawer>

    <VMain>
      <VContainer
        fluid
        class="pa-6"
      >
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Transition
              name="zoom-fade"
              mode="out-in"
            >
              <Suspense
                :timeout="0"
                @fallback="isFallbackStateActive = true"
                @resolve="isFallbackStateActive = false"
              >
                <component :is="Component" />
              </Suspense>
            </Transition>
          </template>
        </RouterView>
      </VContainer>
    </VMain>
  </VLayout>
</template>
