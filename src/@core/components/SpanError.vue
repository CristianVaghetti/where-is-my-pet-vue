<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <span
    class="text-body-1"
    style="color: #ff3e1d; font-size: 1rem !important;"
  >
    {{ message }}
  </span>
</template>