<script setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const isModalOpen = inject('isModalOpen', false)
const pet = inject('petInfo', {})

const handleShelterInfo = shelter => {
  let address = shelter.address
  let address_number = shelter.address_number
  let district = shelter.district
  let city = shelter.city.name
  let state = shelter.city.state.short
  let zipCode = shelter.zip_code

  return `${address}, ${address_number}. ${district}, ${city} - ${state}. CEP ${zipCode}`
}
</script>

<template>
  <VDialog
    v-model="isModalOpen"
    width="1000"
    class="scrollable-content"
    transition="dialog-bottom-transition"
  >
    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard>
        <VCardTitle>
          <VRow class="d-flex">
            <VCol class="text-right">
              <IconBtn
                class="me-n4"
                @click="isModalOpen = false"
              >
                <VIcon
                  color="error"
                  size="40"
                  icon="mdi-close-circle-outline"
                />
              </IconBtn>
            </VCol>
          </VRow>
        </VCardTitle>
        <VCardText>
          <VCard
            class="mb-4"
            variant="tonal"
          >
            <VCardTitle>
              <p class="text-h4">
                Personalidade
              </p>
            </VCardTitle>
            <VCardText
              class="text-h6" 
              style="color:chocolate"
            >
              {{ pet.personality }}
            </VCardText>
          </VCard>

          <VCard
            class="mb-4"
            variant="tonal"
          >
            <VCardTitle>
              <p class="text-h4">
                Informações do abrigo
              </p>
            </VCardTitle>
            <VCardText
              class="text-h6" 
              style="color:chocolate"
            >
              <p>Endereço: {{ handleShelterInfo(pet.shelter) }}</p>
            </VCardText>
          </VCard>

          <VCard
            class="mb-4"
            variant="tonal"
          >
            <VCardTitle>
              <p class="text-h4">
                Responsáveis
              </p>
            </VCardTitle>

            <VCardText
              v-for="user in pet.shelter.users"
              :key="user.id"
              style="color:chocolate"
              class="text-h6" 
            >
              <p>Responsável: {{ user.name }}</p>
              <p>Contato: {{ user.phone }}</p>
              <hr>
            </VCardText>
          </VCard>

          <VRow>
            <VCol class="d-flex">
              <VImg
                width="500"
                :src="pet.image"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol 
              cols="12" 
              class="d-flex justify-center mt-4"
            >
              <VBtn
                color="error"
                @click="isModalOpen = false"
              >
                Voltar
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VDialog>
</template>
