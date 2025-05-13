/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { useThemeStore } from '@/stores/theme'
import {mdi} from 'vuetify/iconsets/mdi'
import {customIcons} from '@/iconsets/index.ts'
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
    themes: {
      light: {
       
        colors: {
          background: '#F3F5F9',
          surface: '#FFFFFF',
          primary: '#1A1C48',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50', 
          warning: '#FFC107',
          text: '#000000',
          
        },
      },
      dark: {
       
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#BB86FC',
          secondary: '#03DAC6',
          accent: '#018786',
          error: '#CF6679',
          info: '#018786',
          success: '#3DDC84',
          warning: '#FFB74D',
          text: '#FFFFFF',
          
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
      custom: customIcons,
    },
  },
})
