import { defineStore } from 'pinia'
import axios from '@axios'

export const useUserStore = defineStore('UserStore', {
  actions: {
    fetchUsers(params) { return axios.get('/users', { params }) },

    fetchProfiles(params) { return axios.get('/profile', { params }) },
  },
})
