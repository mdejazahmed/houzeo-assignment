import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    loadingMessage: ''
  }),

  actions: {
    setLoading(loading = true, message = '') {
      this.isLoading = loading
      this.loadingMessage = message
    },

    clearLoading() {
      this.isLoading = false
      this.loadingMessage = ''
    }
  }
})
