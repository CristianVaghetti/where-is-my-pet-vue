<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { useExpenseStore } from '@/views/apps/expenses/useExpenseStore'

const store = useExpenseStore()
const title = ref('Despesas Fixas')
const form = ref([])
const types = ref([])
const refForm = ref()

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      save()
    }
  })
}

const save = () => {
  const params = {
    types: form.value,
  }

  store.saveFixedExpenses(params).then(res => {
    console.log(res)
  })
}

onMounted(() => {
  store.fetchTypes().then(res => {
    types.value = res.data.data.types
  })
})
</script>

<template>
  <div>
    <VCard class="pa-4">
      <VForm
        ref="refForm"
        @submit.prevent="onSubmit"
      >
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
          <VCol>
            <VAutocomplete
              v-model="form"
              label="Tipos de despesa"
              :items="types"
              :rules="[requiredValidator]"
              item-title="name"
              item-value="name"
              multiple
              chips
              hide-selected
            />
          </VCol>
        </VRow>

        <VRow>
          <VCol cols="12">
            <VBtn
              type="submit"
            >
              Salvar
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </div>
</template>