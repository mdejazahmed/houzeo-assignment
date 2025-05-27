<template>
  <v-chip >
    
    <v-menu
      activator="parent"
      location="top start"
      origin="top start"
      transition="scale-transition"
    >
      <v-card width="300">
        <v-list>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar
                :image="props.user?.name.charAt(0).toUpperCase()"
              ></v-avatar>
            </template>

            <v-list-item-title>{{ props.user?.name }}</v-list-item-title>

            <v-list-item-subtitle>{{ props.user?.email }}</v-list-item-subtitle>

            <template v-slot:append>
              <v-list-item-action>
                <v-btn variant="text" icon @click="menu = false">
                  <v-icon>mdi-close-circle</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>

        <v-list>
          <v-list-item prepend-icon="mdi-briefcase" link>
            <v-list-item-subtitle>{{
              props.user.company?.company_name
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </v-chip>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});

const menu = ref(false);
</script>
