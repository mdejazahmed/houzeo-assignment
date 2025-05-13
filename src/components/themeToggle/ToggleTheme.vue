<template>
  <v-switch
    v-model="isDark"
    hide-details
    density="compact"
    @change="()=>toggleTheme()"
  ></v-switch>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTheme } from 'vuetify'

const themeStore = useThemeStore()
const theme = useTheme()

// Use computed to properly track changes
const isDark = computed({
  get: () => themeStore.isDark,
  set: (value) => themeStore.toggleTheme()
})

// Watch for changes and update Vuetify theme
watch(isDark, (newVal) => {
  theme.global.name.value = newVal ? 'dark' : 'light'
})
</script>
