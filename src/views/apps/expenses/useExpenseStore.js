import axios from '@axios'

export const useExpenseStore = defineStore('expense', {
  // arrow function recommended for full type inference
  actions: {
    async fetchTypes(params) { return axios.get('/expense-types', { params }) },

    async newType(params) { return axios.post('/expense-types', params ) },

    async updateType(params) { return axios.put(`/expense-types/${params.id}`, params ) },

    async removeType(id) { return axios.delete(`/expense-types/${id}`) },

    async fetchExpenses(params) { return axios.get('/expenses', { params }) },

    async newExpense(params) { return axios.post('/expenses', params ) },

    async editExpense(params) { return axios.put(`/expenses/${params.id}`, params ) },

    async removeExpense(id) { return axios.delete(`/expenses/${id}`) },

    async saveFixedExpenses(params) { return axios.post(`/fixed-expenses`,  params ) },
  },
})
