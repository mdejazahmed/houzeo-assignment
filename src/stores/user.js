import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    roles: [],
    permissions: [],
    profile: null
  }),

  getters: {
    hasRole: (state) => (role) => {
      return state.roles.includes(role)
    },

    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    }
  },

  actions: {
    async fetchUserData() {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/user/profile')
        if (!response.ok) throw new Error('Failed to fetch user data')
        
        const data = await response.json()
        this.roles = data.roles || []
        this.permissions = data.permissions || []
        this.profile = data.profile
        
        return data
      } catch (error) {
        console.error('Error fetching user data:', error)
        throw error
      }
    },

    updateProfile(profile) {
      this.profile = profile
    },

    addRole(role) {
      if (!this.roles.includes(role)) {
        this.roles.push(role)
      }
    },

    removeRole(role) {
      this.roles = this.roles.filter(r => r !== role)
    }
  }
})
