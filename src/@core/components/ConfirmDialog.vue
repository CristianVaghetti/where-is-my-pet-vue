<script setup>
const props = defineProps({
  confirmationQuestion: {
    type: String,
    required: true,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'confirm',
])

const updateModelValue = val => {
  emit('update:isDialogVisible', val)
}

const onConfirmation = () => {
  emit('confirm', true)
  updateModelValue(false)
}

const onCancel = () => {
  // emit('confirm', false)
  emit('update:isDialogVisible', false)
}
</script>

<template>
  <!-- 👉 Confirm Dialog -->
  <VDialog
    max-width="500"
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"
  >
    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="my-4"
          style="width: 88px; height: 88px; pointer-events: none;"
        >
          <span class="text-5xl">!</span>
        </VBtn>

        <h6 class="text-lg font-weight-medium">
          {{ props.confirmationQuestion }}
        </h6>
      </VCardText>

      <VCardActions class="align-center justify-center gap-2">
        <VBtn
          variant="elevated"
          @click="onConfirmation"
        >
          Confirmar
        </VBtn>

        <VBtn
          color="secondary"
          variant="tonal"
          @click="onCancel"
        >
          Cancelar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
