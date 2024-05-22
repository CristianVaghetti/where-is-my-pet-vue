<script setup>
import { usePetStore } from '@/views/apps/pets/usePetStore'

const store = usePetStore()

// pagination
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalPets = ref(0)
const pets = ref([])

const filters = ref({
  filter: '',
})

const fetch = () => {
  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    ...filters.value,
  }

  store.fetchPets(params).then(res => {
    pets.value = res.data.data.pets.items
    totalPets.value = res.data.data.pets.total
    totalPage.value =  Math.ceil(res.data.data.pets.total / rowPerPage.value)
  })
}

const paginationData = computed(() => {
  const firstIndex = pets.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = pets.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `${ firstIndex }-${ lastIndex } de ${ totalPets.value }`
})

// provides pagination
provide('row', rowPerPage)
provide('current', currentPage)
provide('total', totalPage)
provide('paginationData', paginationData)

onMounted(() => {
  fetch()
})
</script>

<template>
  <VRow no-gutters>
    <VCol 
      v-for="(pet, index) in pets"
      :key="index"
      cols="12"
      md="6"
      lg="4"
      class="d-flex justify-center mb-6"
    >
      <VCard
        width="400"
      >
        <VCardTitle>
          <VIcon 
            icon="mdi-cat" 
            class="mx-2" 
          />
          {{ pet.personality }}
        </VCardTitle>
        <VCardText>
          <VImg
            cover
            :src="pet.image"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <PaginationComponent
    @changed="fetch"
  />
</template>

<route lang="yaml">
meta:
  action: read
  subject: Home
</route>