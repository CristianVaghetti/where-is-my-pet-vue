<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import pageMiscErrorDark from '@images/pages/page-misc-error-dark.png'
import pageMiscErrorLight from '@images/pages/page-misc-error-light.png'

const pageMiscError = useGenerateImageVariant(pageMiscErrorLight, pageMiscErrorDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      error-title="Page Not Found ⚠️"
      error-description="we couldn't find the page you are looking for"
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="pageMiscError"
        alt="Coming Soon"
        :max-width="500"
        class="mx-auto"
      />
      <VBtn
        to="/home"
        class="mt-10"
      >
        Back to Home
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/misc.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
