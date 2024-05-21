<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    required: true,
  },
  isToastVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isToastVisible',
])

const updateModelValue = val => {
  emit('update:isToastVisible', val)
}
</script>

<template>
  <VSnackbar
    :model-value="props.isToastVisible"
    :timeout="8000"
    :color="variant"
    elevation="50"
    location="botton right"
    close-on-content-click
    @update:model-value="updateModelValue"
  > 
    <VIcon 
      v-if="props.variant === 'error'" 
      icon="mdi-close-circle"
      size="large"
      start
    />
    <VIcon 
      v-else
      icon="mdi-check-circle"
      size="large"
      start
    />
    <span>{{ message }}</span>
  </VSnackbar>
</template>