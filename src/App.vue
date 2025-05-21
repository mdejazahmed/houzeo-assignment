<template>
  <v-app>
    <component :is="layout" theme="dark">
      <router-view />
    </component>
    <Snackbar/>
  </v-app>

</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Snackbar from '@/components/snackbar/Snackbar.vue'

const route = useRoute()
const layout = computed(() => {
  return route.meta.layout || "main"
})




</script>
