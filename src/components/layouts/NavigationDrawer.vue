<template>
  <v-navigation-drawer expand-on-hover>
    <v-list>
      <v-list-item  
        :subtitle="user?.email"
        :title="user.name"
      >
      <template v-slot:prepend>
          <v-avatar color="secondary">
            {{user.name.charAt(0).toUpperCase()}}
          </v-avatar>
        </template>
    </v-list-item>
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
          @click="handleLogout"
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
import { useRouter, useRoute } from "vue-router";
import { ROUTES } from "@/constants/routeKeys";
import {useUserStore} from "@/stores/user";
const userStore = useUserStore()
const {user} = userStore
const { logout } = useAuthStore();
const router = useRouter()
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
  {
    title: "Task List",
    icon: "mdi-format-list-bulleted",
    value: ROUTES.TASK_LIST.name,
  },
];
const handleLogout = () => {
  logout()
  router.push({ name: ROUTES.LOGIN.name })
}
</script>
