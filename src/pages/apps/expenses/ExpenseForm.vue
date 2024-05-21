<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import { requiredValidator } from '@validators'
import { maskMoney } from '@/plugins/masks'

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
  'addExpense',
  'updateExpense',
  'removeExpense',
])

const refForm = ref()

// 👉 Form
const form = ref(JSON.parse(JSON.stringify(props.form)))

const resetEvent = () => {
  form.value = JSON.parse(JSON.stringify(props.form))
  nextTick(() => {
    refForm.value?.resetValidation()
  })
}

watch(() => props.isDrawerOpen, resetEvent)

watch(() => form.value.type_id, () => {
  let type = expenseTypes.value.find(r => r.id === form.value.type_id)

  if(parseFloat(type?.price) > 0){
    form.value.price = type.price
    form.value.addInvoice = type.addInvoice
  }
})

const removeExpense = () => {
  emit('removeExpense', form.value.id)

  // Close drawer
  emit('update:isDrawerOpen', false)
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      form.value.price = form.value.price.replace('.', '').replace(',', '.')

      // If id exist on id => Update form
      if ('id' in form.value)
        emit('updateExpense', form.value)

      // Else => add new form
      else
        emit('addExpense', form.value)

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

const expenseTypes = inject('expenseTypes', [])
const installments = ref(Array.from({ length: 12 }, (_, index) => index + 1))

const startDateTimePickerConfig = computed(() => {
  return {
    enableTime: false,
    dateFormat: `d-m-Y`,
  }
})
</script>

<template>
  <VNavigationDrawer
    temporary
    location="end"
    :model-value="props.isDrawerOpen"
    width="420"
    class="scrollable-content"
    @update:model-value="(val) => $emit('update:isDrawerOpen', val)"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="form.id ? 'Atualizar despesa' : 'Adicionar despesa'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn
          v-show="form.id"
          @click="removeExpense"
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
                  v-model="form.note"
                  label="Identificação"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VAutocomplete
                  v-model="form.type_id"
                  label="Tipo de despesa"
                  :items="expenseTypes"
                  item-value="id"
                  item-title="name"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="form.price"
                  v-maska:[maskMoney]
                  prepend-inner-icon="mdi-currency-brl"
                  label="Preço"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <AppDateTimePicker
                  :key="JSON.stringify(startDateTimePickerConfig)"
                  v-model="form.dueDate"
                  :rules="[requiredValidator]"
                  label="Vencimento/Data da Compra"
                  :config="startDateTimePickerConfig"
                />
              </VCol>

              <VCol cols="12">
                <VSwitch
                  v-model="form.addInvoice"
                  label="Adiciona na fatura"
                />
              </VCol>

              <VCol
                v-if="form.addInvoice"
                cols="12"
              >
                <VAutocomplete
                  v-model="form.installments"
                  label="Parcelas"
                  :items="installments"
                  :rules="[ form.addInvoice ? requiredValidator : true ]"
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
