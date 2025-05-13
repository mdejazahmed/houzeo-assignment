import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark' || false, // default to dark theme
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      // Save theme preference to localStorage
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },

    setTheme(isDark) {
      this.isDark = isDark
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    },
  },
})
