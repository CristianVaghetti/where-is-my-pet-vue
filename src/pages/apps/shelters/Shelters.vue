<script setup>
import { maskUpper } from '@/plugins/masks'
import { useShelterStore } from '@/views/apps/shelters/useShelterStore'
import ShelterForm from './ShelterForm.vue'

const title = ref('Cadastro de abrigos')
const shelters = ref([])
const store = useShelterStore()
const isAddShelterDrawerVisible = ref(false)
const isConfirmDialogVisible = ref(false)
const idToDestroy = ref(0)
const loading = ref(true)

const formEmpty = ref({
  name: '',
  zip_code: '',
  address: '',
  address_number: '',
  district: '',
  address_note: '',
  state_id: null,
  city_id: null,
})

const filters = ref({
  filter: '',
})

const form = ref({})

// pagination
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalShelters = ref(0)

onMounted(() => {
  fetch()
})

const paginationData = computed(() => {
  const firstIndex = shelters.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = shelters.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `${ firstIndex }-${ lastIndex } de ${ totalShelters.value }`
})

const fetch = () => {
  loading.value = true

  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    ...filters.value,
  }

  store.fetchShelters(params).then(res => {
    shelters.value = res.data.data.shelters.items
    totalShelters.value = res.data.data.shelters.total
    totalPage.value =  Math.ceil(res.data.data.shelters.total / rowPerPage.value)
  }).finally(() => {
    loading.value = false
  })
}

const add = e => {
  store.addShelter(e).then(res => {
    fetch()
  })
}

const edit = e => {
  store.editShelter(e).then(res => {
    fetch()
  })
}

const destroy = e => {
  let id = Number.isInteger(e) ? e : idToDestroy.value

  store.removeShelter(id).then(res => {
    fetch()
  })
}

const confirmation = id => {
  isConfirmDialogVisible.value = true
  idToDestroy.value = id
}

const showDrawer = e => {
  form.value = { ...e }
  isAddShelterDrawerVisible.value= true
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
            :disabled="!$can('create', 'shelters')"
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
              Nome
            </th>
            <th class="text-left">
              Cidade
            </th>
            <th class="text-left">
              Rua
            </th>
            <th class="text-left">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(shelter, index) in shelters"
            :key="index"
          >
            <td>{{ shelter.name }}</td>
            <td>{{ shelter.city?.name }}</td>
            <td>{{ shelter.address }}</td>
            <td style="width: 1%; white-space: nowrap;">
              <VBtn
                color="#0000ff"
                title="Editar"
                variant="text"
                icon="mdi-square-edit-outline"
                :disabled="!$can('update', 'shelters') || !shelter.my_shelter"
                @click="showDrawer(shelter)"
              />

              <VBtn
                color="error"
                title="Excluir"
                variant="text"
                icon="mdi-delete-outline"
                :disabled="!$can('delete', 'shelters') || !shelter.my_shelter"
                @click="confirmation(shelter.id)"
              />
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!shelters.length">
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

    <ShelterForm
      v-model:isDrawerOpen="isAddShelterDrawerVisible"
      :form="{ ...form }"
      @update-shelter="edit"
      @add-shelter="add"
      @remove-shelter="destroy"
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
    subject: shelters
  </route>