<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import girlWithLaptopDark from '@images/illustrations/girl-with-laptop-dark.png'
import girlWithLaptopLight from '@images/illustrations/girl-with-laptop-light.png'

const girlWithLaptop = useGenerateImageVariant(girlWithLaptopLight, girlWithLaptopDark)
</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      error-title="Você não tem permissão pra chegar aqui! 🔐"
      error-description="Voçẽ não pode acessar essa página pois não possui a devida permissão. Volte para o início!"
    />

    <!-- 👉 Image -->
    <div class="misc-avatar w-100 text-center">
      <VImg
        :src="girlWithLaptop"
        alt="Coming Soon"
        :max-width="500"
        class="mx-auto"
      />
      <VBtn
        to="/home"
        class="mt-10"
      >
        Voltar
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
  action: read
  subject: Auth
</route>
