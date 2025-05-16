<template>
  <v-layout>
    <NavigationDrawer />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import NavigationDrawer from "@/components/layouts/NavigationDrawer.vue";
</script>
