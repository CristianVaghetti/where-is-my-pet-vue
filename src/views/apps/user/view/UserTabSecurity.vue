<script setup>
const isOldPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
</script>

<template>
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

          <VForm @submit.prevent="() => {}">
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  label="Senha Atual"
                  :type="isOldPasswordVisible ? 'text' : 'password'"
                  density="compact"
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
                  label="Nova Senha"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  density="compact"
                  :append-inner-icon="isNewPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  label="Confirmar Nova Senha"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  density="compact"
                  :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <VBtn type="submit">
                  TROCAR SENHA
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
