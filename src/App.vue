<template>
  <v-app>
    <component :is="layout" theme="dark">
    <router-view />
    </component>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const layout = computed(() => {
  return route.meta.layout || "main"
})




</script>
