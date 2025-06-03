<template>
  <v-layout>
    <!-- <v-app-bar title="Application bar">
      <v-btn icon="mdi-menu" @click="drawer = !drawer"></v-btn>
      
    </v-app-bar> -->
    <NavigationDrawer v-model="drawer" />
    <v-main style="height: 100vh; overflow-y: auto">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import NavigationDrawer from "@/components/layouts/NavigationDrawer.vue";
import { ref } from "vue";
const drawer = ref(true);
</script>
