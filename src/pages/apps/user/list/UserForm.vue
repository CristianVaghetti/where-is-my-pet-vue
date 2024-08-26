<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import { toBase64 } from "@/plugins/fileHelper"
import { requiredValidator, emailValidator, phoneValidator } from '@validators'
import { maskCellPhone, maskPhone, maskUpper, maskNumber } from '@/plugins/masks'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  form: {
    type: null,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'addUser',
  'updateUser',
  'removeUser',
])

const refForm = ref()
const maskPhoneD = ref({})
const profiles = inject('profiles', [])

// 👉 Form
const form = ref(JSON.parse(JSON.stringify(props.form)))

const resetEvent = () => {
  form.value = JSON.parse(JSON.stringify(props.form))
  nextTick(() => {
    refForm.value?.resetValidation()
  })
}

watch(() => props.isDrawerOpen, resetEvent)

const removeUser = () => {
  emit('removeUser', form.value.id)

  // Close drawer
  emit('update:isDrawerOpen', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // If id exist on id => Update form
      if ('id' in form.value)
        emit('updateUser', form.value)

      // Else => add new form
      else
        emit('addUser', form.value)

      // Close drawer
      emit('update:isDrawerOpen', false)
    }
  })
}

// 👉 Form
const onCancel = () => {

  // Close drawer
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    resetEvent()
    refForm.value?.resetValidation()
  })
}

watch(() => form.value.phone, () => {
  let value = form.value.phone?.replace(/\D/g, '')

  maskPhoneD.value = value?.length <= 10 ? maskPhone : maskCellPhone 
})

const fileInput = ref(null)

const openInputImage = () => {
  fileInput.value.click()
}

const handleFileChange = event => {
  const file = event.target.files[0]
  if (file) {
    toBase64(file).then(base64String => {
      form.value.avatar = base64String
    })
  }
}
</script>

<template>
  <VNavigationDrawer
    temporary
    location="end"
    :model-value="props.isDrawerOpen"
    width="420"
    class="scrollable-content"
    @update:model-value="val => $emit('update:isDrawerOpen', val)"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="form.id ? 'Atualizar usuário' : 'Adicionar usuário'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn
          v-show="form.id"
          @click="removeUser"
        >
          <VIcon
            size="18"
            icon="bx-trash"
          />
        </IconBtn>
      </template>
    </AppDrawerHeaderSection>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm
            ref="refForm"
            @submit.prevent="onSubmit"
          >
            <VRow class="d-flex">
              <VCol 
                cols="12"
                class="text-center mb-6"
              >
                <VAvatar
                  class="cursor-pointer"
                  :image="form.avatar"
                  size="200"
                  @click="openInputImage"
                >
                  <VIcon 
                    v-if="!form.avatar"
                    icon="mdi-account-circle"
                    color="info"
                    size="200"
                  />
                </VAvatar>
                <VFileInput
                  ref="fileInput"
                  accept=".png, .jpg, .jpeg"
                  style="display: none;"
                  @change="handleFileChange"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="form.name"
                  v-maska:[maskUpper]
                  label="Nome"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.username"
                  v-maska:[maskUpper]
                  label="Usuário"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VAutocomplete 
                  v-model="form.profile_id"
                  label="Perfil"
                  :items="profiles"
                  item-value="id"
                  item-title="name"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.phone"
                  v-maska:[maskPhoneD]
                  label="Contato"
                  :rules="[requiredValidator, phoneValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  :disabled="form.id"
                  label="Email"
                  :rules="[emailValidator, requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-4"
                >
                  Salvar
                </VBtn>
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="onCancel"
                >
                  Voltar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
