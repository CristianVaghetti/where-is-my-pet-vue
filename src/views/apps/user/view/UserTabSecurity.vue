<script setup>
import { requiredValidator, passwordValidator, confirmedValidator } from '@validators'
import { useUserStore } from '../useUserStore'

const isOldPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const disableBtn = ref(false)
const loading = ref(false)
const refForm = ref()
const store = useUserStore()
const route = useRoute()

const alert = ref({
  text: '',
  type: '',
  show: false,
})

const form = ref({
  password: '',
  new_password: '',
  new_password_confirmation: '',
})

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      change()
    }
  })
}

const alertContent = (type, text) => {
  alert.value = {
    show: true,
    text: text,
    type: type,
  }
}

const change = () => {
  loading.value = true
  
  store.changePassword(Number(route.params.id), form.value).then(res => {
    disableBtn.value = true
    alertContent('success', res.data.msg)
  }).catch(e => {
    alertContent('error', e.response.data.msg)
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <VAlert
    v-model="alert.show"
    :type="alert.type"
    :text="alert.text"
    closable
    class="mb-4"
  />
  <VRow>
    <VCol cols="12">
      <!-- 👉 Change password -->
      <VCard title="Trocar senha">
        <VCardText>
          <VAlert
            variant="text"
            color="warning"
            class="mb-4"
          >
            <VAlertTitle class="mb-1">
              Certifique-se de que a senha atende todos os requisitos!
            </VAlertTitle>
            <span class="text-sm">Mínimo 8 caracteres, um número, um símbolo, uma letra maiúscula e uma minúscula.</span>
          </VAlert>

          <VForm
            ref="refForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.password"
                  label="Senha Atual"
                  :type="isOldPasswordVisible ? 'text' : 'password'"
                  density="compact"
                  :rules="[requiredValidator]"
                  :append-inner-icon="isOldPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isOldPasswordVisible = !isOldPasswordVisible"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.new_password"
                  label="Nova Senha"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  density="compact"
                  :rules="[requiredValidator, passwordValidator]"
                  :append-inner-icon="isNewPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="form.new_password_confirmation"
                  label="Confirmar Nova Senha"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  density="compact"
                  :rules="[requiredValidator, confirmedValidator(form.new_password, form.new_password_confirmation)]"
                  :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <VBtn 
                  v-if="!loading"
                  type="submit"
                  :disabled="form.new_password !== form.new_password_confirmation || disableBtn"
                >
                  TROCAR SENHA
                </VBtn>

                <VProgressLinear
                  v-else
                  indeterminate
                  :height="6"
                  color="primary"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
