import { defineStore } from 'pinia'
import axios from '@axios'

export const useUserStore = defineStore('UserStore', {
  actions: {
    fetchUsers(params) { return axios.get('/users', { params }) },

    fetchUser(id) { return axios.get(`/user/${id}`) },

    fetchProfiles(params) { return axios.get('/profile', { params }) },

    addUser(params) { return axios.post('/user', params) },
    
    updateUser(params) { return axios.put(`/user/${params.id}`, params) },

    removeUser(id) { return axios.delete(`/user/${id}`) },

    changePassword(id, params) { return axios.put(`/user/${id}/change-password`, params) },
  },
})
