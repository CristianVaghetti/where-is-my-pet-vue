<script setup>
const emit = defineEmits([
  'changed',
])

const rowPerPage = inject('row', 10)
const currentPage = inject('current', 1)
const total = inject('total', 1)
const paginationData = inject('paginationData', '')

watch(() => rowPerPage.value, () => {
  currentPage.value = 1
  emit('changed')
})

watch(() => currentPage.value, () => {
  emit('changed')
})
</script>

<template>
  <VDivider class="mt-4" />
  <VCardText class="d-flex justify-end gap-4 pa-2">
    <div
      class="d-flex align-center"
    >
      <span>Linhas por página:</span>
      <VSelect
        v-model="rowPerPage"
        density="compact"
        class="per-page-select"
        variant="solo"
        :items="[5, 10, 20, 30, 50]"
      />
    </div>

    <div class="d-flex align-center pt-1">
      <h6 class="text-sm font-weight-regular">
        {{ paginationData }}
      </h6>
    </div>
    <VPagination
      v-model="currentPage"
      class="pt-1"
      size="small"
      :total-visible="1"
      :length="total"
      @next="selectedRows = []"
      @prev="selectedRows = []"
    />
  </VCardText>
</template>