<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { requiredValidator } from '@validators'
import { maskMoney } from '@/plugins/masks'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'form',
])

const isFormValid = ref(false)
const refForm = ref()

const form = inject('formNewExpenseType', {
  name: '',
  addInvoice: false,
  price: '',
})

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
    form.value = {}
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      form.value.price = form.value.price ? form.value.price.replace('.', '').replace(',', '.') : '0'
      emit('form', { ...form.value })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        form.value = {}
      })
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Adicionar tipo de despesa"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="form.name"
                  :rules="[requiredValidator]"
                  label="Descrição"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.price"
                  v-maska:[maskMoney]
                  label="Preço fixo"
                />
              </VCol>

              <VCol cols="12">
                <VSwitch
                  v-model="form.addInvoice"
                  label="Adiciona no cartão"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
