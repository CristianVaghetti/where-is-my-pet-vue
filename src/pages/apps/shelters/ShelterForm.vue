<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import { requiredValidator } from '@validators'
import { maskCEP, maskUpper, maskNumber } from '@/plugins/masks'
import { getCep, getCities, getStates } from "@/plugins/utils"


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
  'addShelter',
  'updateShelter',
  'removeShelter',
])

const refForm = ref()
const isLoading = ref(true)
const cities = ref([])
const states = ref([])

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

const removeShelter = () => {
  emit('removeShelter', form.value.id)

  // Close drawer
  emit('update:isDrawerOpen', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      // If id exist on id => Update form
      if ('id' in form.value)
        emit('updateShelter', form.value)

      // Else => add new form
      else
        emit('addShelter', form.value)

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

watch(() => form.value.zip_code, () => {
  if (form.value.zip_code && form.value.zip_code.length > 8) {
    getCep(form.value.zip_code).then(res => {
      if (res.data.erro){
        return
      }

      if (!isLoading.value) {
        form.value.address = res.data.logradouro
        form.value.district = res.data.bairro
      }
      
      isLoading.value = false
      
      form.value.state_id = res.data.uf

      setTimeout(() => {
        form.value.city_id = res.data.localidade
      }, 200)
    }).catch(e =>{
      console.log(e)
    })
  }
})

watch(() => form.value.state_id, () => {
  cities.value = []
  form.value.city_id = null
  if (form.value.state_id) {
    getCities(form.value.state_id).then(res => {
      cities.value = res.data.data
    })
  }
})

getStates().then(res => {
  states.value = res.data.data
})
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
      :title="form.id ? 'Atualizar abrigo' : 'Adicionar abrigo'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn
          v-show="form.id"
          @click="removeShelter"
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
                  v-model="form.name"
                  v-maska:[maskUpper]
                  label="Apelido"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.zip_code"
                  v-maska:[maskCEP]
                  label="CEP"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.address"
                  v-maska:[maskUpper]
                  label="Logradouro"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.address_number"
                  v-maska:[maskNumber]
                  label="Número"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.district"
                  v-maska:[maskUpper]
                  label="Bairro"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.address_note"
                  v-maska:[maskUpper]
                  label="Complemento"
                />
              </VCol>

              <VCol cols="12">
                <VSelect 
                  v-model="form.state_id"
                  label="Estado"
                  :items="states"
                  item-title="name"
                  :item-value="Number.isInteger(form.state_id) ? 'id' : 'short'"
                />
              </VCol>

              <VCol cols="12">
                <VSelect 
                  v-model="form.city_id"
                  label="Cidade"
                  :items="cities"
                  item-value="id"
                  item-title="name"
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
