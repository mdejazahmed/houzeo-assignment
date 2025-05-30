<template>
  <v-layout >
    <NavigationDrawer />
    <v-main style="height: 100vh;overflow-y: auto;">
      <v-container >
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import NavigationDrawer from "@/components/layouts/NavigationDrawer.vue";
</script>
