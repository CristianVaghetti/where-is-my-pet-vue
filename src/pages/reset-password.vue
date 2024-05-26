<script setup>
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { requiredValidator, passwordValidator, confirmedValidator } from '@validators'
import girlUnlockPasswordDark from '@images/illustrations/girl-unlock-password-dark.png'
import girlUnlockPasswordLight from '@images/illustrations/girl-unlock-password-light.png'
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import axios from '@axios'

const girlUnlockPassword = useGenerateImageVariant(girlUnlockPasswordLight, girlUnlockPasswordDark)

const route = useRoute()
const refVForm = ref()
const forgot = route.query.forgot === '1' ? true : false
const alerta = ref(false)
const texto = ref('')
const variante = ref('')
const disparouReset = ref(false)

const form = ref({
  newPassword: '',
  confirmPassword: '',
  token: route.query.token,
})

const errors = ref({
  newPassword: undefined,
  confirmPassword: undefined,
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      resetarSenha()
  })
}

const resetarSenha = () => {
  const formData = { ...form.value }

  disparouReset.value = true

  axios.post('user/password/reset', formData).then(r => { 
    texto.value = r.data.msg
    variante.value = 'success'
    alerta.value = true
    disparouReset.value = false


  }).catch(e => {
    texto.value = 'Ocorreu um erro, tente novamente!'
    variante.value = 'error'
    alerta.value = true
    disparouReset.value = false
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
          <h6 class="text-h6 mb-5">
            Redefinir senha 🔒
          </h6>
          <p class="mb-0">
            Não salvamos as senhas dos nossos usuários, como você não recorda a sua, iremos redefini-la!
          </p>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.newPassword"
                  :rules="[requiredValidator, passwordValidator]"
                  :error-messages="errors.newPassword"
                  label="Nova senha"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  class="mb-4"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- Confirm Password -->

                <VTextField
                  v-model="form.confirmPassword"
                  :rules="[requiredValidator, confirmedValidator(form.confirmPassword, form.newPassword)]"
                  :error-messages="errors.confirmPassword"
                  label="Confirmar Senha"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
                  class="mb-4"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />

                <!-- reset password -->

                <VBtn
                  v-if="variante !== 'success'"
                  block
                  :disabled="disparouReset"
                  @click="onSubmit"
                >
                  <VProgressCircular
                    v-if="disparouReset"
                    indeterminate
                    color="primary"
                    :size="30"
                    :width="5"
                  />
                  <span v-if="!disparouReset">Redefinir senha</span>
                </VBtn>

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
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="bx-chevron-left"
                    class="flip-in-rtl"
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
