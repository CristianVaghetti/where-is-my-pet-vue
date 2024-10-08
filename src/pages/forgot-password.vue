<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { requiredValidator, emailValidator } from '@validators'
import girlUnlockPasswordDark from '@images/illustrations/girl-unlock-password-dark.png'
import girlUnlockPasswordLight from '@images/illustrations/girl-unlock-password-light.png'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import axios from '@axios'

const girlUnlockPassword = useGenerateImageVariant(girlUnlockPasswordLight, girlUnlockPasswordDark)

const refVForm = ref()
const email = ref('')
const disparouEmail = ref(false)
const alerta = ref(false)
const texto = ref('')
const variante = ref('')

const errors = ref({
  email: undefined,
})

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      disparaEmail()
  })
}

const disparaEmail = () => {
  disparouEmail.value = true

  axios.post('user/password/forgot', { email: email.value }).then(r => {
    texto.value = 'Mensagem enviada com sucesso!'
    variante.value = 'success'
    alerta.value = true
    errors.value.email = undefined // se o usuário digitou errado depois corrigiu tem que limpar o erro
    disparouEmail.value = false
  }).catch(e => {
    if (e.response) {
      errors.value.email = e.response.data.msg
    } else {
      texto.value = 'Ocorreu um erro, tente novamente!'
      variante.value = 'error'
      alerta.value = true
      disparouEmail.value = false
    }
  })
}
</script>

<template>
  <VRow
    class="auth-wrapper"
    no-gutters
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <!-- illustration -->
      
      <VImg
        :src="girlUnlockPassword"
        class="auth-illustration"
        cover
      />
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-6"
      >
        <VCardItem class="justify-start">
          <template #prepend>
            <div class="d-flex">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
            </div>
          </template>

          <VCardTitle class="auth-title">
            {{ themeConfig.app.title }}
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <h6 class="text-h6 mb-1">
            Esqueceu sua senha? 🔒
          </h6>
          <p class="mb-0">
            Digite o seu email cadastrado! Vamos enviar instruções para recuperar sua senha
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                  label="Email"
                  type="email"
                  class="mb-4"
                />

                <!-- Reset link -->
                <VBtn
                  v-if="variante !== 'success'"
                  :disabled="disparouEmail"
                  block
                  @click="onSubmit"
                >
                  <VProgressCircular
                    v-if="disparouEmail"
                    indeterminate
                    color="primary"
                    :size="30"
                    :width="5"
                  />
                  <span v-if="!disparouEmail">Enviar</span>
                </VBtn>

                <!-- compoenente de alertas -->
                
                <VSnackbar
                  v-model="alerta"
                  :timeout="8000"
                  :color="variante"
                  variant="tonal"
                  elevation="50"
                  location="botton right"
                  close-on-content-click
                > 
                  <VIcon 
                    :icon="variante === 'success' ? 'mdi-check-circle' : 'mdi-close-circle'"
                    size="large"
                    start
                  />
                  <span>{{ texto }}</span>
                </VSnackbar>

                <!-- back to login -->

                <RouterLink
                  class="d-flex align-center justify-center mt-5"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    class="flip-in-rtl"
                    icon="bx-chevron-left"
                  />
                  <span>Voltar à tela de login</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
