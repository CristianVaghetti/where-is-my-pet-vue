<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import { requiredValidator, emailValidator } from '@validators'
import { maskUpper, maskPhone } from '@/plugins/masks'
import { toBase64 } from "@/plugins/fileHelper"

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
  'addPet',
  'updatePet',
  'removePet',
])

const refForm = ref()
const isLoading = ref(true)
const cities = ref([])
const states = ref([])
const shelters = inject('shelters', [])

// 👉 Form
const form = ref(JSON.parse(JSON.stringify(props.form)))

const resetEvent = () => {
  form.value = JSON.parse(JSON.stringify(props.form))
  nextTick(() => {
    refForm.value?.resetValidation()
  })

  isLoading.value = true
}

watch(() => props.isDrawerOpen, resetEvent)

const removePet = () => {
  emit('removePet', form.value.id)

  // Close drawer
  emit('update:isDrawerOpen', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // If id exist on id => Update form
      if ('id' in form.value)
        emit('updatePet', form.value)

      // Else => add new form
      else
        console.log(form.value)
        
      // emit('addPet', form.value)

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

const fileInput = ref(null)

const openInputImage = () => {
  fileInput.value.click()
}

const handleFileChange = event => {
  const file = event.target.files[0]
  if (file) {
    // const reader = new FileReader()

    // reader.onload = e => {
    //   form.value.avatar_file = e.target.result
    // }

    // reader.readAsDataURL(file)
    toBase64(file).then(base64String => {
      form.value.avatar_file = base64String
    })
  }
}
</script>

<template>
  <VNavigationDrawer
    temporary
    location="end"
    :model-value="props.isDrawerOpen"
    width="620"
    class="scrollable-content"
    @update:model-value="val => $emit('update:isDrawerOpen', val)"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="form.id ? 'Atualizar pet' : 'Adicionar pet'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn
          v-show="form.id"
          @click="removePet"
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
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.personality"
                  v-maska:[maskUpper]
                  label="Personalidade"
                  placeholder="Características marcandes físicas ou de personalidade"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VAutocomplete
                  v-model="form.shelter_id"
                  :items="shelters"
                  label="Abrigo"
                  :rules="[requiredValidator]"
                  item-title="name"
                  item-value="id"
                />
              </VCol>

              <VCol 
                class="text-center" 
                @click="openInputImage"
              >
                <VIcon
                  v-if="!form.avatar_file"
                  class="cursor-pointer"
                  size="150"
                  icon="mdi-camera"
                />
                <VImg
                  v-else
                  cover
                  :src="form.avatar_file"
                />
                <VFileInput 
                  ref="fileInput"
                  accept=".png, .jpg, .jpeg"
                  style="display: none;"
                  :rules="[ requiredValidator ]"
                  @change="handleFileChange"
                /><br>
                <SpanError v-if="!form.avatar_file" message="Foto obrigatória" />
              </VCol>

              <VCol cols="12">
                <VSwitch
                  v-model="form.found"
                  label="Encontrado"
                />
              </VCol>

              <VDivider class="mb-5" />

              <template v-if="form.found">
                <VCol cols="12">
                  <VTextField
                    v-model="form.owner_name"
                    v-maska:[maskUpper]
                    label="Nome do dono"
                    :rules="[form.found ? requiredValidator : true]"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    v-model="form.owner_email"
                    v-maska:[maskUpper]
                    label="Email do dono"
                    :rules="[form.found ? requiredValidator : true, emailValidator]"
                  />
                </VCol>

                <VCol cols="12">
                  <VTextField
                    v-model="form.owner_phone"
                    v-maska:[maskPhone]
                    label="Contato do dono"
                    :rules="[form.found ? requiredValidator : true]"
                  />
                </VCol>
              </template>

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
