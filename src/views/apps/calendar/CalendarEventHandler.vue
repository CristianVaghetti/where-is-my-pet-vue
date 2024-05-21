<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import { requiredValidator } from '@validators'
import { useExpenseStore } from '@/views/apps/expenses/useExpenseStore'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  event: {
    type: null,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'addEvent',
  'updateEvent',
  'removeEvent',
])

const refForm = ref()

// 👉 Event
const event = ref(JSON.parse(JSON.stringify(props.event)))

const resetEvent = () => {
  event.value = JSON.parse(JSON.stringify(props.event))
  nextTick(() => {
    refForm.value?.resetValidation()
  })
}

watch(() => props.isDrawerOpen, resetEvent)

const removeEvent = () => {
  emit('removeEvent', event.value.id)

  // Close drawer
  emit('update:isDrawerOpen', false)
}

const handleSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {

      // If id exist on id => Update event
      if ('id' in event.value)
        emit('updateEvent', event.value)

      // Else => add new event
      else
        emit('addEvent', event.value)

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

const startDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: false,
    dateFormat: `Y-m-d`,
  }

  if (event.value.end)
    config.maxDate = event.value.end
  
  return config
})

const expenseTypes = ref([])
const installments = ref([])

const expenseStore = useExpenseStore()

onMounted(() => {
  installments.value = Array.from({ length: 12 }, (_, index) => index + 1)

  expenseStore.fetch().then(res => {
    expenseTypes.value = res.data.data.types
  })

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
      :title="event.id ? 'Atualizar despesa' : 'Adicionar despesa'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn
          v-show="event.id"
          @click="removeEvent"
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
            @submit.prevent="handleSubmit"
          >
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="event.note"
                  label="Identificação"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VAutocomplete
                  v-model="event.type_id"
                  label="Tipo de despesa"
                  :items="expenseTypes"
                  item-value="id"
                  item-title="name"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="event.price"
                  prepend-inner-icon="mdi-currency-brl"
                  label="Preço"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <AppDateTimePicker
                  :key="JSON.stringify(startDateTimePickerConfig)"
                  v-model="event.due_date"
                  :rules="[requiredValidator]"
                  label="Vencimento/Data da Compra"
                  :config="startDateTimePickerConfig"
                />
              </VCol>

              <VCol cols="12">
                <VSwitch
                  v-model="event.addInvoice"
                  label="Adiciona na fatura"
                />
              </VCol>

              <VCol cols="12">
                <VAutocomplete
                  v-model="event.installments"
                  label="Parcelas"
                  :items="installments"
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
