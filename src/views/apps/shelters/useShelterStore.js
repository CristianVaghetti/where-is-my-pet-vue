import axios from '@axios'

export const useShelterStore = defineStore('shelter', {
  // arrow function recommended for full type inference
  actions: {
    async fetchShelters(params) { return axios.get('/shelter', { params }) },

    async addShelter(params) { return axios.post('/shelter', params) },

    async editShelter(params) { return axios.put(`/shelter/${params.id}`, params) },

    async removeShelter(id) { return axios.delete(`/shelter/${id}`) },
  },
})
