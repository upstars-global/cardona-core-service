<script setup lang="tsx">
import { useStorage } from '@vueuse/core'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useTheme } from 'vuetify'
import { staticPrimaryColor } from '@/plugins/vuetify/theme'
import { Direction, Layout, Skins, Theme } from '@core/enums'
import { useConfigStore } from '@core/stores/config'
import { AppContentLayoutNav, ContentWidth } from '@layouts/enums'
import { cookieRef, namespaceConfig } from '@layouts/stores/config'
import { themeConfig } from '@themeConfig'

import borderSkinDark from '@images/customizer-icons/border-dark.svg'
import borderSkinLight from '@images/customizer-icons/border-light.svg'
import collapsedDark from '@images/customizer-icons/collapsed-dark.svg'
import collapsedLight from '@images/customizer-icons/collapsed-light.svg'
import compactDark from '@images/customizer-icons/compact-dark.svg'
import compactLight from '@images/customizer-icons/compact-light.svg'
import darkThemeDark from '@images/customizer-icons/dark-theme-dark.svg'
import darkThemeLight from '@images/customizer-icons/dark-theme-light.svg'
import defaultSkinDark from '@images/customizer-icons/default-dark.svg'
import defaultSkinLight from '@images/customizer-icons/default-light.svg'
import lightThemeDark from '@images/customizer-icons/light-theme-dark.svg'
import lightThemeLight from '@images/customizer-icons/light-theme-light.svg'
import ltrDark from '@images/customizer-icons/ltr-dark.svg'
import ltrLight from '@images/customizer-icons/ltr-light.svg'
import rtlDark from '@images/customizer-icons/rtl-dark.svg'
import rtlLight from '@images/customizer-icons/rtl-light.svg'
import systemThemeDark from '@images/customizer-icons/system-theme-dark.svg'
import systemThemeLight from '@images/customizer-icons/system-theme-light.svg'
import wideDark from '@images/customizer-icons/wide-dark.svg'
import wideLight from '@images/customizer-icons/wide-light.svg'

const isNavDrawerOpen = ref(false)

const configStore = useConfigStore()

// 👉 Primary Color
const vuetifyTheme = useTheme()

const colors = [staticPrimaryColor, '#0D9394', '#FFAB1D', '#EB3D63', '#2092EC']
const customPrimaryColor = ref('#ffffff')

watch(
  () => configStore.theme,
  () => {
    const cookiePrimaryColor = cookieRef(`${vuetifyTheme.name.value}ThemePrimaryColor`, null).value

    if (cookiePrimaryColor && !colors.includes(cookiePrimaryColor))
      customPrimaryColor.value = cookiePrimaryColor
  },
  { immediate: true },
)

// ℹ️ It will set primary color for current theme only
const setPrimaryColor = useDebounceFn((color: string) => {
  vuetifyTheme.themes.value[vuetifyTheme.name.value].colors.primary = color

  // ℹ️ We need to store this color value in cookie so vuetify plugin can pick on next reload
  cookieRef<string | null>(`${vuetifyTheme.name.value}ThemePrimaryColor`, null).value = color

  // ℹ️ Update initial loader color
  useStorage<string | null>(namespaceConfig('initial-loader-color'), null).value = color
}, 100)

const lightTheme = useGenerateImageVariant(lightThemeLight, lightThemeDark)
const darkTheme = useGenerateImageVariant(darkThemeLight, darkThemeDark)
const systemTheme = useGenerateImageVariant(systemThemeLight, systemThemeDark)
const defaultSkin = useGenerateImageVariant(defaultSkinLight, defaultSkinDark)
const borderSkin = useGenerateImageVariant(borderSkinLight, borderSkinDark)
const collapsed = useGenerateImageVariant(collapsedLight, collapsedDark)
const compact = useGenerateImageVariant(compactLight, compactDark)
const compactContent = useGenerateImageVariant(compactLight, compactDark)
const wideContent = useGenerateImageVariant(wideLight, wideDark)
const ltrImg = useGenerateImageVariant(ltrLight, ltrDark)
const rtlImg = useGenerateImageVariant(rtlLight, rtlDark)

// 👉 Mode
const themeMode = computed(() => {
  return [
    {
      bgImage: lightTheme.value,
      value: Theme.Light,
    },
    {
      bgImage: darkTheme.value,
      value: Theme.Dark,
    },
    {
      bgImage: systemTheme.value,
      value: Theme.System,
    },
  ]
})

// 👉 Skin
const themeSkin = computed(() => {
  return [
    {
      bgImage: defaultSkin.value,
      value: Skins.Default,
      label: 'Default',
    },
    {
      bgImage: borderSkin.value,
      value: Skins.Bordered,
      label: 'Bordered',
    },
  ]
})

// 👉 Layout
const currentLayout = ref<'vertical' | 'collapsed' | 'horizontal'>(configStore.isVerticalNavCollapsed ? 'collapsed' : configStore.appContentLayoutNav)

const layouts = computed(() => {
  return [
    {
      bgImage: defaultSkin.value,
      value: Layout.Vertical,
      label: 'Vertical',
    },
    {
      bgImage: collapsed.value,
      value: Layout.Collapsed,
      label: 'Collapsed',
    },
    {
      bgImage: compact.value,
      value: Layout.Horizontal,
      label: 'Horizontal',
    },
  ]
})

watch(currentLayout, () => {
  if (currentLayout.value === 'collapsed') {
    configStore.isVerticalNavCollapsed = true
    configStore.appContentLayoutNav = AppContentLayoutNav.Vertical
  }
  else {
    configStore.isVerticalNavCollapsed = false
    configStore.appContentLayoutNav = currentLayout.value
  }
})

// watch vertical sidebar collapse state
watch(
  () => configStore.isVerticalNavCollapsed,
  () => {
    currentLayout.value = configStore.isVerticalNavCollapsed
      ? 'collapsed'
      : configStore.appContentLayoutNav
  },
)

// 👉 Content Width
const contentWidth = computed(() => {
  return [
    {
      bgImage: compactContent.value,
      value: ContentWidth.Boxed,
      label: 'Compact',
    },
    {
      bgImage: wideContent.value,
      value: ContentWidth.Fluid,
      label: 'Wide',
    },
  ]
})

// 👉 Direction
const currentDir = ref(configStore.isAppRTL ? 'rtl' : 'ltr')

const direction = computed(() => {
  return [
    {
      bgImage: ltrImg.value,
      value: Direction.Ltr,
      label: 'Left to right',
    },
    {
      bgImage: rtlImg.value,
      value: Direction.Rtl,
      label: 'Right to left',
    },
  ]
})

watch(currentDir, () => {
  if (currentDir.value === 'rtl')
    configStore.isAppRTL = true

  else
    configStore.isAppRTL = false
})

// check if any value set in cookie
const isCookieHasAnyValue = ref(false)

const { locale } = useI18n({ useScope: 'global' })

const isActiveLangRTL = computed(() => {
  const lang = themeConfig.app.i18n.langConfig.find(l => l.i18nLang === locale.value)

  return lang?.isRTL ?? false
})

watch([
  () => vuetifyTheme.current.value.colors.primary,
  configStore.$state,
  locale,
], () => {
  const initialConfigValue = [
    staticPrimaryColor,
    staticPrimaryColor,
    themeConfig.app.theme,
    themeConfig.app.skin,
    themeConfig.verticalNav.isVerticalNavSemiDark,
    themeConfig.verticalNav.isVerticalNavCollapsed,
    themeConfig.app.contentWidth,
    isActiveLangRTL.value,
    themeConfig.app.contentLayoutNav,
  ]

  const themeConfigValue = [
    vuetifyTheme.themes.value.light.colors.primary,
    vuetifyTheme.themes.value.dark.colors.primary,
    configStore.theme,
    configStore.skin,
    configStore.isVerticalNavSemiDark,
    configStore.isVerticalNavCollapsed,
    configStore.appContentWidth,
    configStore.isAppRTL,
    configStore.appContentLayoutNav,
  ]

  currentDir.value = configStore.isAppRTL ? 'rtl' : 'ltr'

  isCookieHasAnyValue.value = JSON.stringify(themeConfigValue) !== JSON.stringify(initialConfigValue)
}, { deep: true, immediate: true })

// remove all theme related values from localStorage
const resetCustomizer = async () => {
  // reset themeConfig values
  vuetifyTheme.themes.value.light.colors.primary = staticPrimaryColor
  vuetifyTheme.themes.value.dark.colors.primary = staticPrimaryColor

  configStore.theme = themeConfig.app.theme
  configStore.skin = themeConfig.app.skin
  configStore.isVerticalNavSemiDark = themeConfig.verticalNav.isVerticalNavSemiDark
  configStore.appContentLayoutNav = themeConfig.app.contentLayoutNav
  configStore.appContentWidth = themeConfig.app.contentWidth
  configStore.isAppRTL = isActiveLangRTL.value
  configStore.isVerticalNavCollapsed = themeConfig.verticalNav.isVerticalNavCollapsed
  useStorage<string | null>(namespaceConfig('initial-loader-color'), null).value = staticPrimaryColor
  currentLayout.value = 'vertical'

  cookieRef('lightThemePrimaryColor', null).value = null
  cookieRef('darkThemePrimaryColor', null).value = null

  await nextTick()

  isCookieHasAnyValue.value = false

  customPrimaryColor.value = '#ffffff'
}
</script>

<template>
  <div class="d-lg-block d-none">
    <VBtn
      icon
      size="small"
      class="app-customizer-toggler rounded-s-lg rounded-0"
      style="z-index: 1001;"
      @click="isNavDrawerOpen = true"
    >
      <VIcon
        size="22"
        icon="tabler-settings"
      />
    </VBtn>

    <VNavigationDrawer
      v-model="isNavDrawerOpen"
      temporary
      touchless
      border="0"
      location="end"
      width="400"
      :scrim="false"
      class="app-customizer"
    >
      <!-- 👉 Header -->
      <div class="customizer-heading d-flex align-center justify-space-between">
        <div>
          <h6 class="text-h6">
            Theme Customizer
          </h6>
          <span class="text-body-1">Customize & Preview in Real Time</span>
        </div>

        <div class="d-flex align-center gap-1">
          <VBtn
            icon
            variant="text"
            size="small"
            color="medium-emphasis"
            @click="resetCustomizer"
          >
            <VBadge
              v-show="isCookieHasAnyValue"
              dot
              color="error"
              offset-x="-30"
              offset-y="-15"
            />

            <VIcon
              size="22"
              icon="tabler-refresh"
            />
          </VBtn>

          <VBtn
            icon
            variant="text"
            color="medium-emphasis"
            size="small"
            @click="isNavDrawerOpen = false"
          >
            <VIcon
              icon="tabler-x"
              size="22"
            />
          </VBtn>
        </div>
      </div>

      <VDivider />

      <PerfectScrollbar
        tag="ul"
        :options="{ wheelPropagation: false }"
      >
        <!-- SECTION Theming -->
        <CustomizerSection
          title="Theming"
          :divider="false"
        >
          <!-- 👉 Primary Color -->
          <div class="d-flex flex-column gap-3">
            <h6 class="text-base font-weight-medium">
              Primary Color
            </h6>

            <div
              class="d-flex align-center gap-x-3"
              style="column-gap: 0.7rem;"
            >
              <div
                v-for="color in colors"
                :key="color"
                style="
                border-radius: 0.375rem;
                outline: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
                padding-block: 0.625rem;
                padding-inline: 0.625rem;"
                class="cursor-pointer"
                :style="vuetifyTheme.current.value.colors.primary === color ? `outline-color: ${color}; outline-width:2px;` : ''"
                @click="setPrimaryColor(color)"
              >
                <div
                  style="border-radius: 0.375rem;block-size: 1.875rem; inline-size: 1.875rem;"
                  :style="{ backgroundColor: color }"
                />
              </div>

              <div
                class="cursor-pointer"
                style="
              border-radius: 0.375rem;
              outline: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
              padding-block: 0.625rem;
              padding-inline: 0.625rem;"
                :style="vuetifyTheme.current.value.colors.primary === customPrimaryColor ? `outline-color: ${customPrimaryColor}; outline-width:2px;` : ''"
              >
                <VBtn
                  icon
                  size="30"
                  :color="vuetifyTheme.current.value.colors.primary === customPrimaryColor ? customPrimaryColor : $vuetify.theme.current.dark ? '#8692d029' : '#4b465c29'"
                  variant="flat"
                  style="border-radius: 0.375rem;"
                >
                  <VIcon
                    size="22"
                    icon="tabler-color-picker"
                    :color="vuetifyTheme.current.value.colors.primary === customPrimaryColor ? 'rgb(var(--v-theme-on-primary))' : ''"
                  />
                </VBtn>

                <VMenu
                  activator="parent"
                  :close-on-content-click="false"
                >
                  <VList>
                    <VListItem>
                      <VColorPicker
                        v-model="customPrimaryColor"
                        mode="hex"
                        :modes="['hex']"
                        @update:model-value="setPrimaryColor"
                      />
                    </VListItem>
                  </VList>
                </VMenu>
              </div>
            </div>
          </div>

          <!-- 👉 Theme -->
          <div class="d-flex flex-column gap-3">
            <h6 class="text-base font-weight-medium">
              Theme
            </h6>

            <CustomRadiosWithImage
              :key="configStore.theme"
              v-model:selected-radio="configStore.theme"
              :radio-content="themeMode"
              :grid-column="{ cols: '4' }"
            />
          </div>

          <!-- 👉 Skin -->
          <div class="d-flex flex-column gap-3">
            <h6 class="text-base font-weight-medium">
              Skins
            </h6>

            <CustomRadiosWithImage
              :key="configStore.skin"
              v-model:selected-radio="configStore.skin"
              :radio-content="themeSkin"
              :grid-column="{ cols: '4' }"
            >
              <template #label="item">
                <span class="text-sm text-medium-emphasis">{{ item?.label }}</span>
              </template>
            </CustomRadiosWithImage>
          </div>

          <!-- 👉 Semi Dark -->
          <div
            class="mt-4 align-center justify-space-between"
            :class="vuetifyTheme.global.name.value === 'light' && configStore.appContentLayoutNav === AppContentLayoutNav.Vertical ? 'd-flex' : 'd-none'"
          >
            <VLabel
              for="customizer-semi-dark"
              class="text-high-emphasis"
            >
              Semi Dark Menu
            </VLabel>

            <div>
              <VSwitch
                id="customizer-semi-dark"
                v-model="configStore.isVerticalNavSemiDark"
                class="ms-2"
              />
            </div>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->

        <!-- SECTION LAYOUT -->
        <CustomizerSection title="Layout">
          <!-- 👉 Layouts -->
          <div class="d-flex flex-column gap-3">
            <h6 class="text-base font-weight-medium">
              Layout
            </h6>

            <CustomRadiosWithImage
              :key="currentLayout"
              v-model:selected-radio="currentLayout"
              :radio-content="layouts"
              :grid-column="{ cols: '4' }"
            >
              <template #label="item">
                <span class="text-sm text-medium-emphasis">{{ item.label }}</span>
              </template>
            </CustomRadiosWithImage>
          </div>

          <!-- 👉 Content Width -->
          <div class="d-flex flex-column gap-3">
            <h6 class="text-base font-weight-medium">
              Content
            </h6>

            <CustomRadiosWithImage
              :key="configStore.appContentWidth"
              v-model:selected-radio="configStore.appContentWidth"
              :radio-content="contentWidth"
              :grid-column="{ cols: '4' }"
            >
              <template #label="item">
                <span class="text-sm text-medium-emphasis">{{ item.label }}</span>
              </template>
            </CustomRadiosWithImage>
          </div>

          <!-- 👉 Direction -->
          <div class="d-flex flex-column gap-3">
            <h6 class="text-base font-weight-medium">
              Direction
            </h6>

            <CustomRadiosWithImage
              :key="currentDir"
              v-model:selected-radio="currentDir"
              :radio-content="direction"
              :grid-column="{ cols: '4' }"
            >
              <template #label="item">
                <span class="text-sm text-medium-emphasis">{{ item?.label }}</span>
              </template>
            </CustomRadiosWithImage>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->
      </PerfectScrollbar>
    </VNavigationDrawer>
  </div>
</template>

<style lang="scss">
.app-customizer {
  .customizer-section {
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    gap: 1.5rem;
  }

  .customizer-heading {
    padding-block: 1.125rem;
    padding-inline: 1.25rem;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

.app-customizer-toggler {
  position: fixed !important;
  inset-block-start: 50%;
  inset-inline-end: 0;
}
</style>
