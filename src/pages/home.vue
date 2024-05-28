<script setup>
import { usePetStore } from '@/views/apps/pets/usePetStore'
import { useShelterStore } from '@/views/apps/shelters/useShelterStore'
import HomeModal from '@/pages/apps/pets/HomeModal.vue'

const storePet = usePetStore()
const storeShelter = useShelterStore()

// pagination
const rowPerPage = ref(20)
const currentPage = ref(1)
const totalPage = ref(1)
const totalPets = ref(0)
const pets = ref([])
const isModalOpen = ref(false)
const petInfo = ref({})
const types = ref([])
const shelters =ref([])

const filters = ref({
  filter: '',
  type_id: null,
  shelter_id: null,
})

const fetch = () => {
  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    ...filters.value,
  }

  storePet.fetchPets(params).then(res => {
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

const handleIcon = type => {
  switch (type) {
  case 1:
    return 'mdi-dog'
    
  case 2:
    return 'mdi-cat'

  case 3:
    return 'mdi-horse'
    
  default:
    return 'mdi-alert-circle'
  }
}

const openModal = pet => {
  petInfo.value = { ...pet }
  isModalOpen.value= true
}

provide('petInfo', petInfo)
provide('isModalOpen', isModalOpen)

// provides pagination
provide('row', rowPerPage)
provide('current', currentPage)
provide('total', totalPage)
provide('paginationData', paginationData)

onMounted(() => {
  fetch()

  storePet.fetchTypes().then(res => {
    types.value = res.data.data.types
  })

  storeShelter.fetchShelters().then(res => {
    shelters.value = res.data.data.shelters
  })
})

watch([() => filters.value.type_id, () => filters.value.shelter_id], fetch)
</script>

<template>
  <div>
    <VCard title="Filtros">
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VAutocomplete 
              v-model="filters.type_id"
              :items="types"
              label="Tipo"
              item-title="name"
              item-value="id"
            />
          </VCol>

          <VCol cols="6">
            <VAutocomplete 
              v-model="filters.shelter_id"
              :items="shelters"
              label="Abrigo"
              item-title="name"
              item-value="id"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <PaginationComponent @changed="fetch" />
    <VRow no-gutters>
      <VCol 
        v-for="(pet, index) in pets"
        :key="index"
        cols="12"
        md="6"
        lg="4"
        class="d-flex justify-center mb-2"
      >
        <VCard
          width="500"
        >
          <VCardTitle>
            <VIcon 
              :icon="handleIcon(pet.type_id)" 
              class="me-2" 
            />
            {{ pet.personality }}
          </VCardTitle>
          <VCardText>
            <VImg
              class="cursor-pointer"
              :src="pet.image"
              @click="openModal(pet)"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <PaginationComponent @changed="fetch" />
    <HomeModal />
  </div>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Home
</route>