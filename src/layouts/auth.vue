<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card class="elevation-12">
          <v-card-text class="pa-8">
            <router-view />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Route meta
export default {
  routeMeta: {
    title: 'Auth Layout',
    requiresAuth: false,
    publicRoute: true
  }
}
</script>

<script setup>
// Your setup code here
</script>

<style scoped>
/* Add some custom styling for the auth layout */
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.v-card-text {
  background: var(--v-background);
}
</style>
