import { defineStore } from 'pinia'

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
    async login(credentials) {
      try {
        // Replace with your actual login API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })

        const data = await response.json()
        
        if (response.ok) {
          this.token = data.token
          this.user = data.user
          this.isAuthenticated = true
          
          // Store token in localStorage
          localStorage.setItem('token', data.token)
          
          return true
        }
        
        throw new Error(data.message || 'Login failed')
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },

    async checkAuth() {
      if (!this.token) {
        this.isAuthenticated = false
        return false
      }

      try {
        // Replace with your actual auth check API
        const response = await fetch('/api/auth/check', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          this.user = data.user
          this.isAuthenticated = true
          return true
        }

        this.isAuthenticated = false
        return false
      } catch (error) {
        console.error('Auth check error:', error)
        this.isAuthenticated = false
        return false
      }
    }
  },
})
