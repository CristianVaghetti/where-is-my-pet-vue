<script setup>
import { maskUpper } from '@/plugins/masks'
import { useUserStore } from '@/views/apps/user/useUserStore'
import UserForm from './UserForm.vue'

const title = ref('Cadastro de usuários')
const users = ref([])
const store = useUserStore()
const isAddUserDrawerVisible = ref(false)
const isConfirmDialogVisible = ref(false)
const idToDestroy = ref(0)
const profiles = ref([])

const formEmpty = ref({
  profile_id: null,
  avatar: null,
  name: null,
  username: null,
  phone: null,
  email: null,
  password: null,
  status: false,
})

const filters = ref({
  filter: '',
})

const form = ref({})

// pagination
const rowPerPage = ref(5)
const currentPage = ref(1)
const totalPage = ref(1)
const totalUsers = ref(0)

onMounted(() => {
  fetch()
})

const paginationData = computed(() => {
  const firstIndex = users.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  const lastIndex = users.value.length + (currentPage.value - 1) * rowPerPage.value
  
  return `${ firstIndex }-${ lastIndex } de ${ totalUsers.value }`
})

const fetch = () => {
  let params = {
    page: currentPage.value,
    length: rowPerPage.value,
    ...filters.value,
  }

  store.fetchUsers(params).then(res => {
    users.value = res.data.data.users.items
    totalUsers.value = res.data.data.users.total
    totalPage.value =  Math.ceil(res.data.data.users.total / rowPerPage.value)
  })

  store.fetchProfiles().then(res => {
    profiles.value = res.data.data.profiles
  })
}

provide('profiles', profiles)

const add = e => {
  store.addUser(e).then(res => {
    fetch()
  })
}

const edit = e => {
  store.editUser(e).then(res => {
    fetch()
  })
}

const destroy = e => {
  let id = Number.isInteger(e) ? e : idToDestroy.value

  store.removeUser(id).then(res => {
    fetch()
  })
}

const confirmation = id => {
  isConfirmDialogVisible.value = true
  idToDestroy.value = id
}

const showDrawer = e => {
  form.value = { ...e }
  isAddUserDrawerVisible.value= true
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
              ID
            </th>
            <th class="text-left">
              Nome
            </th>
            <th class="text-left">
              Usuário
            </th>
            <th class="text-left">
              Perfil
            </th>
            <th class="text-left">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(user, index) in users"
            :key="index"
          >
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.profile?.name }}</td>
            <td style="width: 1%; white-space: nowrap;">
              <VBtn
                color="#0000ff"
                title="Editar"
                variant="text"
                icon="mdi-square-edit-outline"
                @click="showDrawer(user)"
              />

              <VBtn
                color="error"
                title="Excluir"
                variant="text"
                icon="mdi-delete-outline"
                @click="confirmation(user.id)"
              />
            </td>
          </tr>
        </tbody>
        <tfoot v-show="!users.length">
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

    <UserForm
      v-model:isDrawerOpen="isAddUserDrawerVisible"
      :form="{ ...form }"
      @update-user="edit"
      @add-user="add"
      @remove-user="destroy"
    />

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Deseja realmente excluir?"
      @confirm="destroy"
    />
  </div>
</template>