<script setup>
import { usePetStore } from '@/views/apps/pets/usePetStore'
import { useShelterStore } from '@/views/apps/shelters/useShelterStore'
import { getCities, getStates } from '@/plugins/utils'
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
const cities = ref([])
const states = ref([])

const filters = ref({
  home: true,
  filter: '',
  type_id: null,
  shelter_id: null,
  city_id: null,
  state_id: null,
})

const fetch = () => {
  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    ...filters.value,
  }

  if(filters.value.state_id){
    getCities(filters.value.state_id).then(res => {
      cities.value = res.data.data
    })
  } else {
    cities.value = []
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

  storeShelter.fetchShelters({ home: true }).then(res => {
    shelters.value = res.data.data.shelters.map(r => {
      return { name: `${r.name} - ${r.address}, ${r.address_number} - ${r.city.name.toUpperCase()}`, id: r.id }
    })
  })

  getStates().then(res => {
    states.value = res.data.data
  })
})

watch([
  () => filters.value.type_id, 
  () => filters.value.shelter_id,
  () => filters.value.state_id,
  () => filters.value.city_id,
], fetch)
</script>

<template>
  <div>
    <VCard title="Filtros">
      <VCardText>
        <VRow>
          <VCol cols="6">
            <VAutocomplete 
              v-model="filters.shelter_id"
              :items="shelters"
              label="Abrigo"
              item-title="name"
              item-value="id"
            />
          </VCol>

          <VCol cols="2">
            <VAutocomplete 
              v-model="filters.type_id"
              :items="types"
              label="Tipo"
              item-title="name"
              item-value="id"
            />
          </VCol>
        
          <VCol cols="2">
            <VAutocomplete 
              v-model="filters.state_id"
              :items="states"
              label="Estado"
              item-title="name"
              item-value="id"
            />
          </VCol>

          <VCol cols="2">
            <VAutocomplete 
              v-model="filters.city_id"
              :items="cities"
              label="Cidade"
              item-title="name"
              item-value="id"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <PaginationComponent 
      v-if="pets.length" 
      @changed="fetch" 
    />
    <VRow class="mt-4">
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
      <VRow v-if="!pets.length">
        <VAlert
          class="text-center mt-3 mx-6"
          color="error"
          text="Não foi encontrado nenhum animal com esta configuração de filtros."
        />
      </VRow>
    </VRow>
    <PaginationComponent
      v-if="pets.length" 
      @changed="fetch" 
    />
    <HomeModal />
  </div>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Home
</route>