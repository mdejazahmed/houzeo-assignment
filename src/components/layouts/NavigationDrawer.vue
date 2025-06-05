<template>
  <v-navigation-drawer expand-on-hover>
    <v-list>
      <HouzeoLogo />
    </v-list>
    <v-divider></v-divider>
    <v-list density="compact" color="primary" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.value"
        :value="item.value"
        :to="item.to"
        :prepend-icon="item.icon"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
      
     
    </v-list>
    <template v-slot:append>
      <v-list>
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
import { useRouter } from "vue-router";
import HouzeoLogo from "@/components/HouzeoLogo.vue";
const router = useRouter();
const route = useRoute();
const navItems = [
  {
    title: "Home",
    icon: "mdi-home-outline",
    value: "home",
    to: "/",
  },
];
</script>
