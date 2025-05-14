import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || {},
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
    setUser(user) {
   this.user = user
   localStorage.setItem('user', JSON.stringify(user))
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
