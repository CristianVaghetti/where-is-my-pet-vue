import { defineStore } from 'pinia'
import axios from '@axios'

export const useUserStore = defineStore('UserStore', {
  actions: {
    fetchUsers(params) { return axios.get('/users', { params }) },

    fetchUser(id) { return axios.get(`/user/${id}`) },

    fetchProfiles(params) { return axios.get('/profile', { params }) },

    addUser(params) { return axios.post('/user', params) },
    
    editUser(params) { return axios.put(`/user/${params.id}`, params) },
  },
})
