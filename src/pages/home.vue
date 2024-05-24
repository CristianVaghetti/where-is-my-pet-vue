<script setup>
import { usePetStore } from '@/views/apps/pets/usePetStore'
import HomeModal from '@/pages/apps/pets/HomeModal.vue'

const store = usePetStore()

// pagination
const rowPerPage = ref(20)
const currentPage = ref(1)
const totalPage = ref(1)
const totalPets = ref(0)
const pets = ref([])
const isModalOpen = ref(false)
const petInfo = ref({})

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
})
</script>

<template>
  <div>
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