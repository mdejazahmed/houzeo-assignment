<template>
  <v-layout>
    <v-navigation-drawer expand-on-hover>
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          subtitle="sandra_a88@gmailcom"
          title="Sandra Adams"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav height="100%" color="primary">
        <v-list-item
          v-for="item in drawerItems"
          :key="item.value"
          :value="item.value"
          :prepend-icon="item.icon"
          :title="item.title"
        ></v-list-item>
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

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import ToggleTheme from '@/components/themeToggle/ToggleTheme.vue'
import { useAuthStore } from '@/stores/auth'
const {logout} = useAuthStore()
const drawerItems = [
  {
    title: 'Projects',
    icon: 'mdi-home-outline',
    value: 'projects',
  },
  {
    title: 'Team',
    icon: 'mdi-account-group-outline',
    value: 'team',
  },
  {
    title: 'Weekly Plan',
    icon: 'mdi-calendar-week-outline',
    value: 'weekly_plan',
  },
]


</script>
