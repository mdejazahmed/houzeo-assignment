/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import request from '@/plugins/axios'

const app = createApp(App)
app.config.globalProperties.$apiRequest = request
registerPlugins(app)
app.mount('#app')
