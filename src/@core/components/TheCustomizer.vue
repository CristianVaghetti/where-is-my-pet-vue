<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useTheme } from 'vuetify'
import { staticPrimaryColor } from '@/plugins/vuetify/theme'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import {
  RouteTransitions,
  Skins,
} from '@core/enums'
import {
  AppContentLayoutNav,
  ContentWidth,
  FooterType,
  NavbarType,
} from '@layouts/enums'
import { themeConfig } from '@themeConfig'

const isNavDrawerOpen = ref(false)
const { theme, skin, appRouteTransition, navbarType, footerType, isVerticalNavCollapsed, isVerticalNavSemiDark, appContentWidth, appContentLayoutNav, isAppRtl, isNavbarBlurEnabled, isLessThanOverlayNavBreakpoint } = useThemeConfig()

// 👉 Primary Color
const vuetifyTheme = useTheme()

// const vuetifyThemesName = Object.keys(vuetifyTheme.themes.value)
const initialThemeColors = JSON.parse(JSON.stringify(vuetifyTheme.current.value.colors))

const colors = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'error',
]

const setPrimaryColor = color => {
  const currentThemeName = vuetifyTheme.name.value

  vuetifyTheme.themes.value[currentThemeName].colors.primary = color
  localStorage.setItem(`${ themeConfig.app.title }-${ currentThemeName }ThemePrimaryColor`, color)
  localStorage.setItem(`${ themeConfig.app.title }-initial-loader-color`, color)
}

const getBoxColor = (color, index) => index ? color : staticPrimaryColor
const { width: windowWidth } = useWindowSize()

const headerValues = computed(() => {
  const entries = Object.entries(NavbarType)
  if (appContentLayoutNav.value === AppContentLayoutNav.Horizontal)
    return entries.filter(([_, val]) => val !== NavbarType.Hidden)
  
  return entries
})
</script>

<template>
  <template v-if="!isLessThanOverlayNavBreakpoint(windowWidth)">
    <VBtn
      icon
      size="small"
      class="app-customizer-toggler rounded-s-lg rounded-0"
      style="z-index: 1001;"
      @click="isNavDrawerOpen = true"
    >
      <VIcon icon="bxs-cog" />
    </VBtn>

    <VNavigationDrawer
      v-model="isNavDrawerOpen"
      temporary
      location="end"
      width="400"
      :scrim="false"
      class="app-customizer"
    >
      <!-- 👉 Header -->
      <div class="customizer-heading d-flex align-center justify-space-between">
        <div>
          <h6 class="text-h6">
            Customizar página
          </h6>
          <span class="text-body-1">Altere a página em tempo real</span>
        </div>
        <VBtn
          icon
          variant="text"
          color="secondary"
          size="x-small"
          @click="isNavDrawerOpen = false"
        >
          <VIcon
            icon="bx-x"
            size="20"
          />
        </VBtn>
      </div>

      <VDivider />

      <PerfectScrollbar
        tag="ul"
        :options="{ wheelPropagation: false }"
      >
        <!-- SECTION Theming -->
        <CustomizerSection
          title="THEMING"
          :divider="false"
        >
          <!-- 👉 Skin -->

          <!-- 👉 Theme -->
          <h6 class="mt-3 text-base font-weight-regular">
            Tema
          </h6>
          <VRadioGroup
            v-model="theme"
            inline
          >
            <VRadio
              v-for="themeOption in ['system', 'light', 'dark']"
              :key="themeOption"
              :label="themeOption"
              :value="themeOption"
              class="text-capitalize"
            />
          </VRadioGroup>

          <!-- 👉 Primary color -->
          <h6 class="mt-3 text-base font-weight-regular">
            Cor primária
          </h6>
          <div class="d-flex gap-x-4 mt-2">
            <div
              v-for="(color, index) in colors"
              :key="color"
              style="width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; transition: all 0.25s ease;"
              :style="{ backgroundColor: getBoxColor(initialThemeColors[color], index) }"
              class="cursor-pointer d-flex align-center justify-center"
              :class="{ 'elevation-4': vuetifyTheme.current.value.colors.primary === getBoxColor(initialThemeColors[color], index) }"
              @click="setPrimaryColor(getBoxColor(initialThemeColors[color], index))"
            >
              <VFadeTransition>
                <VIcon
                  v-show="vuetifyTheme.current.value.colors.primary === (getBoxColor(initialThemeColors[color], index))"
                  icon="bx-check"
                  color="white"
                />
              </VFadeTransition>
            </div>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->

        <!-- SECTION LAYOUT -->
        <!-- !SECTION -->

        <!-- SECTION Menu -->
        <CustomizerSection title="MENU">
          <!-- 👉 Collapsed Menu -->
          <div
            v-if="appContentLayoutNav === AppContentLayoutNav.Vertical"
            class="d-flex align-center justify-space-between"
          >
            <VLabel
              for="customizer-menu-collapsed"
              class="text-high-emphasis"
            >
              Menu escondido
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-collapsed"
                v-model="isVerticalNavCollapsed"
                class="ms-2"
              />
            </div>
          </div>

          <!-- 👉 Semi Dark Menu -->
          <div
            class="align-center justify-space-between"
            :class="vuetifyTheme.global.name.value === 'light' && appContentLayoutNav === AppContentLayoutNav.Vertical ? 'd-flex' : 'd-none'"
          >
            <VLabel
              for="customizer-menu-semi-dark"
              class="text-high-emphasis"
            >
              Tema semi-escuro
            </VLabel>
            <div>
              <VSwitch
                id="customizer-menu-semi-dark"
                v-model="isVerticalNavSemiDark"
                class="ms-2"
              />
            </div>
          </div>
        </CustomizerSection>
        <!-- !SECTION -->

        <!-- SECTION MISC -->
        <!-- !SECTION -->
      </PerfectScrollbar>
    </VNavigationDrawer>
  </template>
</template>

<style lang="scss">
.app-customizer {
  .customizer-section {
    padding: 1.25rem;
  }

  .customizer-heading {
    padding-block: 0.875rem;
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
  transform: translateY(-50%);
}
</style>
