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
    },
    getFirstName: (state) => {
      return state.user?.email?.split(".")[0].charAt(0).toUpperCase()+state.user?.email?.split(".")[0].slice(1)
    },
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
