import { defineStore } from 'pinia'
import { ROUTES } from '@/constants/routeKeys'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    user: null
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
  },

  actions: {
     setToken({accessToken, refreshToken}) {
      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      this.token = accessToken
      this.isAuthenticated = true
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

    },

    checkAuth() {
      if (!this.token) {
        this.isAuthenticated = false
        return false
      }
      return true
    }
  },
})
