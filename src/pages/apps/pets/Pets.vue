<script setup>
import { maskUpper } from '@/plugins/masks'
import { usePetStore } from '@/views/apps/pets/usePetStore'
import PetForm from './PetForm.vue'

const title = ref('Cadastro de animais')
const pets = ref([])
const store = usePetStore()
const isAddPetDrawerVisible = ref(false)
const isConfirmDialogVisible = ref(false)
const idToDestroy = ref(0)
const shelters = ref([])
const petTypes = ref([])
const loading = ref(true)

const formEmpty = ref({
  personality: '',
  shelter_id: null,
  file: null,
  owner_name: null,
  owner_email: null,
  owner_phone: null,
})

const filters = ref({
  filter: '',
})

const form = ref({})

// pagination
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalPets = ref(0)

onMounted(() => {
  fetch()
})

const paginationData = computed(() => {
  const firstIndex = pets.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = pets.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `${ firstIndex }-${ lastIndex } de ${ totalPets.value }`
})

const fetch = () => {
  loading.value = true
  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    ...filters.value,
  }

  store.fetchPets(params).then(res => {
    pets.value = res.data.data.pets.items
    totalPets.value = res.data.data.pets.total
    totalPage.value =  Math.ceil(res.data.data.pets.total / rowPerPage.value)
  }).finally(() => {
    loading.value = false
  })

  store.fetchShelters().then(res => {
    shelters.value = res.data.data.shelters
  })

  store.fetchTypes().then(res => {
    petTypes.value = res.data.data.types
  })
}

provide('shelters', shelters)
provide('types', petTypes)

const add = e => {
  store.addPet(e).then(res => {
    fetch()
  })
}

const edit = e => {
  store.editPet(e).then(res => {
    fetch()
  })
}

const destroy = e => {
  let id = Number.isInteger(e) ? e : idToDestroy.value

  store.removePet(id).then(res => {
    fetch()
  })
}

const confirmation = id => {
  isConfirmDialogVisible.value = true
  idToDestroy.value = id
}

const showDrawer = e => {
  form.value = { ...e }
  isAddPetDrawerVisible.value= true
}

let timer
watch(() => filters.value.filter, newDescription => {
  const desc = newDescription

  if(desc === ''){
    fetch()

    return
  }

  clearTimeout(timer)
  timer = setTimeout(() => {
    if (newDescription !== desc) {
      return
    }

    currentPage.value = 1
    fetch()
  }, 1000)
})

// provides pagination
provide('row', rowPerPage)
provide('current', currentPage)
provide('total', totalPage)
provide('paginationData', paginationData)
</script>

<template>
  <div>
    <VCard class="pa-4">
      <VRow 
        no-gutters
        justify="center"
        class="mt-4"
      >
        <VCol cols="2">
          <h3 class="mx-n4 mt-n4">
            {{ title }}
          </h3>
        </VCol>
      </VRow>
    </VCard>
  
    <VCard class="pa-4 mt-6">
      <VRow 
        justify="end"
      >
        <VCol
          cols="4"
          class="d-flex"
        >
          <VTextField
            v-model="filters.filter"
            v-maska:[maskUpper]
            density="compact"
            label="Pesquisar"
            class="me-3"
          />
        
          <VBtn
            color="success"
            prepend-icon="mdi-plus"
            :disabled="!$can('create', 'pets')"
            @click="showDrawer(formEmpty)"
          >
            Cadastrar
          </VBtn>
        </VCol>
      </VRow>

      <VProgressLinear
        v-if="loading"
        class="my-4"
        indeterminate
        :height="6"
        color="primary"
      />

      <VTable v-else>
        <thead>
          <tr>
            <th class="text-left">
              ID
            </th>
            <th class="text-left">
              Personalidade
            </th>
            <th class="text-left">
              Cidade
            </th>
            <th class="text-left">
              Abrigo
            </th>
            <th class="text-left">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(pet, index) in pets"
            :key="index"
          >
            <td>{{ pet.id }}</td>
            <td>{{ pet.personality.substr(0,50) }}</td>
            <td>{{ pet.shelter?.city?.name }}</td>
            <td>{{ pet.shelter?.name }}</td>
            <td style="width: 1%; white-space: nowrap;">
              <VBtn
                color="#0000ff"
                title="Editar"
                variant="text"
                icon="mdi-square-edit-outline"
                :disabled="!$can('update', 'pets')"
                @click="showDrawer(pet)"
              />

              <VBtn
                color="error"
                title="Excluir"
                variant="text"
                icon="mdi-delete-outline"
                :disabled="!$can('delete', 'pets')"
                @click="confirmation(pet.id)"
              />
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!pets.length">
          <tr>
            <td
              colspan="7"
              class="text-center text-body-1"
            >
              Nenhum registro encontrado
            </td>
          </tr>
        </tfoot>
      </VTable>
      <PaginationComponent
        @changed="fetch"
      />
    </VCard>

    <PetForm
      v-model:isDrawerOpen="isAddPetDrawerVisible"
      :form="{ ...form }"
      @update-pet="edit"
      @add-pet="add"
      @remove-pet="destroy"
    />

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Deseja realmente excluir?"
      @confirm="destroy"
    />
  </div>
</template>

<route lang="yaml">
  meta:
    action: read
    subject: pets
  </route>