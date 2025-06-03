<template>
  <v-main>
    <v-app-bar :title="route.meta.title" scroll-behavior="hide" class="px-4">
      <template v-slot:prepend>
        <router-link :to="ROUTES.HOME.path">
          <v-img src="/avatar.svg" width="50" />
        </router-link>
      </template>
      <template v-slot:append>
        <v-avatar color="secondary">
          {{ user.name.charAt(0).toUpperCase() }}
        </v-avatar>
      </template>
    </v-app-bar>
    <v-container fluid>
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
import { ROUTES } from "@/constants/routeKeys";
import { useUserStore } from "@/stores/user";
import { useRoute } from "vue-router";
const userStore = useUserStore();
const route = useRoute();
const { user } = userStore;
</script>
