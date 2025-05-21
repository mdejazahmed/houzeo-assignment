<template>
  <v-switch
    :model-value="isDark"
    hide-details
    density="compact"
    @change="toggleTheme"
  ></v-switch>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useTheme } from 'vuetify'
import { useSnackbarStore } from '@/stores/app'

const themeStore = useThemeStore()
const theme = useTheme()
const snackbarStore = useSnackbarStore()

// Use computed to properly track changes
const isDark = computed(() => themeStore.isDark)

const toggleTheme = () => {
  themeStore.toggleTheme()
  snackbarStore.showSnackbar({msg:"Theme Changed"})
}

// Watch for changes and update Vuetify theme
watch(isDark, (newVal) => {
  theme.global.name.value = newVal ? 'dark' : 'light'
})
</script>
