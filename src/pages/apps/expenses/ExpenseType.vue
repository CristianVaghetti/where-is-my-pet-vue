<script setup>
import { useExpenseStore } from '../../../views/apps/expenses/useExpenseStore'
import ExpenseTypeForm from './ExpenseTypeForm.vue'
import { maskUpper } from '@/plugins/masks'

const title = ref('Tipos de despesa')
const filter = ref('')
const types = ref([])
const isConfirmDialogVisible = ref(false)
const idToDestroy = ref(0)
const store = useExpenseStore()
const isAddExpenseTypeDrawerVisible = ref(false)
const formNewExpenseType = ref({})

// pagination
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalTypes = ref(0)

const paginationData = computed(() => {
  const firstIndex = types.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = types.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `${ firstIndex }-${ lastIndex } de ${ totalTypes.value }`
})

const confirmation = id => {
  isConfirmDialogVisible.value = true
  idToDestroy.value = id
}

const destroy = confirm => {
  if(!confirm) return

  store.removeType(idToDestroy.value).then(res => {
    fetch()
    idToDestroy.value = 0
  }).then(e => {
    console.error(e)
  })
}

const fetch = () => {
  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    filter: filter.value,
  }

  store.fetchTypes(params).then(res => {
    types.value = res.data.data.types.items
    totalTypes.value = res.data.data.types.total
    totalPage.value =  Math.ceil(res.data.data.types.total / rowPerPage.value)
  })
}

const save = form => {
  if (!form.id) {
    store.newType(form).then(res => {
      fetch()
    })
  } else {
    store.updateType(form).then(res => {
      fetch()
    })
  }
}

const edit = type => {
  isAddExpenseTypeDrawerVisible.value = true
  formNewExpenseType.value = { ...type }
}

let timer
watch(() => filter.value, newDescription => {
  const desc = newDescription

  if(desc === ''){
    fetch()

    return
  }

  clearTimeout(timer)
  timer = setTimeout(() => {
    if (newDescription !== desc || desc.length < 3) {
      return
    }

    currentPage.value = 1
    fetch()
  }, 2000)
})

onMounted(() => {
  fetch()
})

// provides pagination
provide('row', rowPerPage)
provide('current', currentPage)
provide('total', totalPage)
provide('paginationData', paginationData)

// provide edit
provide('formNewExpenseType', formNewExpenseType)
</script>

<template>
  <div>
    <VRow>
      <VCol>
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
      </VCol>
    </VRow>
          
    <VRow>
      <VCol>
        <VCard class="pa-4">
          <VRow 
            justify="end"
          >
            <VCol
              cols="4"
              class="d-flex"
            >
              <VTextField
                v-model="filter"
                v-maska:[maskUpper]
                density="compact"
                label="Pesquisar"
                class="me-3"
              />

              <VBtn
                color="success"
                prepend-icon="mdi-plus"
                @click="isAddExpenseTypeDrawerVisible = true"
              >
                Cadastrar
              </VBtn>
            </VCol>
          </VRow>

          <VTable density="default">
            <thead>
              <tr>
                <th class="text-left">
                  Descrição
                </th>
                <th class="text-left">
                  Valor Fixo
                </th>
                <th class="text-left">
                  Acrescenta fatura 
                </th>
                <th class="text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(type, index) in types"
                :key="index"
              >
                <td class="text-left">
                  {{ type.name }}
                </td>
                <td class="text-left">
                  R$ {{ type.price }}
                </td>
                <td class="text-left">
                  {{ type.addInvoice ? 'SIM' : 'NÃO' }}
                </td>
                <td 
                  class="text-center" 
                  style="width: 1%; white-space: nowrap;"
                >
                  <VBtn
                    color="#0000ff"
                    title="Editar"
                    variant="text"
                    icon="mdi-square-edit-outline"
                    @click="edit(type)"
                  />

                  <VBtn
                    color="error"
                    title="Excluir"
                    variant="text"
                    icon="mdi-delete-outline"
                    @click="confirmation(type.id)"
                  />
                </td>
              </tr>
            </tbody>
            <tfoot v-show="!types.length">
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
      </VCol>
    </VRow>

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Deseja realmente excluir?"
      @confirm="destroy"
    />

    <ExpenseTypeForm
      v-model:isDrawerOpen="isAddExpenseTypeDrawerVisible"
      @form="save"
    />
  </div>
</template>