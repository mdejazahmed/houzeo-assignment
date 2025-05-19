<template>
  <v-navigation-drawer expand-on-hover>
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        subtitle="sandra_a88@gmailcom"
        title="Sandra Adams"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav height="100%" v-model="currentNav">
      <v-list-item
        active-class="bg-primary"
        v-for="item in navItems"
        :key="item.value"
        :value="item.value"
        :to="item.value"
        :title="item.title"
        rounded="lg"
        block
        :prepend-icon="item.icon"
      >
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
          @click="logout"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-theme-light-dark" title="Theme">
          <template v-slot:append>
            <v-list-item-action>
              <ToggleTheme />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import ToggleTheme from "@/components/themeToggle/ToggleTheme.vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
import { ROUTES } from "@/constants/routeKeys";
const { logout } = useAuthStore();
const currentNav = ref(false);
const route = useRoute();
const navItems = [
  {
    title: "Home",
    icon: "mdi-home-outline",
    value: ROUTES.HOME.name,
  },
  {
    title: "Weekly Plans",
    icon: "mdi-calendar-week-outline",
    value: ROUTES.WEEKLY_PLANS.name,
  },
];
</script>
