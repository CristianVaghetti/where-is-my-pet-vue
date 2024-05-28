<script setup>
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import axios from '@axios'
import boyWithRocketDark from '@images/illustrations/boy-with-rocket-dark.png'
import boyWithRocketLight from '@images/illustrations/boy-with-rocket-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { emailValidator, requiredValidator } from '@validators'
import { VForm } from 'vuetify/components/VForm'

const boyWithRocket = useGenerateImageVariant(boyWithRocketLight, boyWithRocketDark)
const isPasswordVisible = ref(false)
const route = useRoute()
const router = useRouter()
const ability = useAppAbility()

const errors = ref({
  email: undefined,
  password: undefined,
})

const refVForm = ref()
const email = ref('vaghetticristian@gmail.com')
const password = ref('Teste@123')
const showLoginForm = ref(false)
const loading = ref(false)

const userAbilities = [
  {
    action: 'read',
    subject: 'Auth',
  },
  {
    action: 'read',
    subject: 'Home',
  },
]

const login = () => {
  loading.value = true

  axios.post('/auth', {
    email: email.value,
    password: password.value,
  }).then(r => {
    const { token, user, roles } = r.data.data

    const abilities = userAbilities.concat(roles)

    localStorage.setItem('userAbilities', JSON.stringify(abilities))
    ability.update(abilities)
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('accessToken', JSON.stringify(token))
    localStorage.setItem('lastActiveTime', Date.now())

    // Redirect to `to` query if exist or redirect to index route
    router.replace(route.query.to ? String(route.query.to) : '/home')
  }).catch(e => {
    errors.value.email = e.response?.data?.msg || 'Ocorreu um erro inesperado!'
  }).finally(() => {
    loading.value = false
  })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)
      login()
  })
}

const giveGuestAbilities = () => {
  email.value = 'guest@guest.com'
  password.value = 'guest'

  login()
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <!-- illustration -->
      <div class="position-relative w-100 pa-8">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="700"
            :src="boyWithRocket"
            class="auth-illustration"
          />
        </div>
      </div>
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
            Bem vindo ao {{ themeConfig.app.title }}! 👋🏻
          </h6>

          <p class="mb-0">
            Faça login ou epenas procure seu pet
          </p>
        </VCardText>

        <VCardText 
          v-if="!showLoginForm" 
          class="d-flex my-4"
        >
          <VBtn 
            class="me-4"
            color="primary"
            rounded="xl"
            size="x-large"
            @click="showLoginForm = true"
          >
            Login
          </VBtn>
        
          <VBtn
            color="primary"
            rounded="xl"
            size="x-large"
            @click="giveGuestAbilities"
          >
            Procurar meu pet
          </VBtn>
        </VCardText>

        <VCardText v-if="showLoginForm">
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-6">
                  <RouterLink
                    class="text-primary text-sm ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Esqueci minha senha
                  </RouterLink>
                </div>

                <VBtn
                  block
                  class="mb-1"
                  :disabled="loading"
                  @click="onSubmit"
                >
                  <VProgressCircular
                    v-if="loading"
                    indeterminate
                    color="success"
                    :size="30"
                    :width="5"
                  />
                  <span v-if="!loading">Enviar</span>
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>Quero criar minha conta!</span>
                <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'register' }"
                >
                  Criar conta
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
