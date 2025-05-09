<template>
  <v-app>
    <component :is="layout" >
    <router-view />
    </component>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import defaultLayout from '@/layouts/default.vue'
const route = useRoute()
const layout = computed(() => {
  return route.meta.layout || defaultLayout
})
</script>
