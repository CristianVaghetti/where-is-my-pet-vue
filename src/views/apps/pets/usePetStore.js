import axios from '@axios'

export const usePetStore = defineStore('pet', {
  // arrow function recommended for full type inference
  actions: {
    async fetchPets(params) { return axios.get('/pet', { params }) },

    async fetchShelters(params) { return axios.get('/shelter', { params }) },

    async fetchTypes() { return axios.get('/pet-types') },

    async addPet(params) { return axios.post('/pet', params) },

    async updatePet(params) { return axios.put(`/pet/${params.id}`, params) },

    async removePet(id) { return axios.delete(`/pet/${id}`) },
  },
})
