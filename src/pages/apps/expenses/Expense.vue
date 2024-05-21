<script setup>
import { maskUpper } from '@/plugins/masks'
import { useExpenseStore } from '../../../views/apps/expenses/useExpenseStore'
import ExpenseForm from './ExpenseForm.vue'
import { format } from 'date-fns'

const title = ref('Despesas')
const expenses = ref([])
const expenseTypes = ref([])
const store = useExpenseStore()
const isAddExpenseDrawerVisible = ref(false)
const isConfirmDialogVisible = ref(false)
const idToDestroy = ref(0)

provide('expenseTypes', expenseTypes)

const formEmpty = ref({
  note: '',
  type_id: null,
  price: '',
  dueDate: format(new Date(), 'dd-MM-yyyy'),
  addInvoice: false,
  installments: null,
})

const filters = ref({
  filter: '',
  type: null,
  date: null,
  fullMonth: false,
})

const form = ref({ dueDate: format(new Date(), 'dd-MM-yyyy') })

// pagination
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalExpenses = ref(0)

onMounted(() => {
  fetch()

  store.fetchTypes().then(res => {
    expenseTypes.value = res.data.data.types
  })
})

const paginationData = computed(() => {
  const firstIndex = expenses.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = expenses.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `${ firstIndex }-${ lastIndex } de ${ totalExpenses.value }`
})

const fetch = () => {
  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    ...filters.value,
  }

  store.fetchExpenses(params).then(res => {
    expenses.value = res.data.data.expenses.items
    totalExpenses.value = res.data.data.expenses.total
    totalPage.value =  Math.ceil(res.data.data.expenses.total / rowPerPage.value)
  })
}

const add = e => {
  store.newExpense(e).then(res => {
    fetch()
  })
}

const edit = e => {
  store.editExpense(e).then(res => {
    fetch()
  })
}

const destroy = e => {
  let id = Number.isInteger(e) ? e : idToDestroy.value

  store.removeExpense(id).then(res => {
    fetch()
  })
}

const confirmation = id => {
  isConfirmDialogVisible.value = true
  idToDestroy.value = id
}

const showDrawer = e => {
  form.value = { ...e }
  isAddExpenseDrawerVisible.value= true
}

watch([() => filters.value.type, () => filters.value.fullMonth, () => filters.value.date], fetch)
watch(() => filters.value.date, () => filters.value.fullMonth = false)


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

const startDateTimePickerConfig = computed(() => {
  return {
    enableTime: false,
    dateFormat: `d-m-Y`,
  }
})
</script>

<template>
  <div>
    <VCard class="pa-4">
      <VRow 
        no-gutters
        justify="center"
        class="mt-4"
      >
        <VCol cols="1">
          <h3 class="mx-n4 mt-n4">
            {{ title }}
          </h3>
        </VCol>
      </VRow>

      <VRow>
        <VCol 
          cols="3"
        >
          <VAutocomplete
            v-model="filters.type"
            label="Tipo"
            item-title="name"
            item-value="id"
            :items="expenseTypes"
            class="me-6"
          />
        </VCol>

        <VCol 
          cols="2"
        >
          <AppDateTimePicker
            :key="JSON.stringify(startDateTimePickerConfig)"
            v-model="filters.date"
            label="Data"
            :config="startDateTimePickerConfig"
          />
        </VCol>

        <VSwitch
          v-if="filters.date"
          v-model="filters.fullMonth"
          label="Mês inteiro"
          class="ms-6 mt-3"
        />
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
            @click="showDrawer(formEmpty)"
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
              Tipo
            </th>
            <th class="text-left">
              Vencimento
            </th>
            <th class="text-left">
              Valor
            </th>
            <th class="text-left">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(expense, index) in expenses"
            :key="index"
          >
            <td>{{ expense.note }}</td>
            <td>{{ expense.type.name }}</td>
            <td>{{ expense.dueDate }}</td>
            <td>{{ expense.price }}</td>
            <td style="width: 1%; white-space: nowrap;">
              <VBtn
                color="#0000ff"
                title="Editar"
                variant="text"
                icon="mdi-square-edit-outline"
                @click="showDrawer(expense)"
              />

              <VBtn
                color="error"
                title="Excluir"
                variant="text"
                icon="mdi-delete-outline"
                @click="confirmation(expense.id)"
              />
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!expenses.length">
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

    <ExpenseForm
      v-model:isDrawerOpen="isAddExpenseDrawerVisible"
      :form="{ ...form }"
      @update-expense="edit"
      @add-expense="add"
      @remove-expense="destroy"
    />

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Deseja realmente excluir?"
      @confirm="destroy"
    />
  </div>
</template>