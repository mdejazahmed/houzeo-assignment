<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12" sm="6" md="7" class="d-flex flex-column">
          <img src="@/assets/login.svg" width="50%" class="mx-auto" />
          <h2>Lorem Ipsum Dolor Amet, Ipsum dolor lorem amet.</h2>
          <p>
            Lorem Ipsum Dolor Amet, Ipsum dolor lorem amet, Lorem Ipsum Dolor
            Amet, Ipsum dolor lorem amet, Lorem Ipsum Dolor Amet, Ipsum dolor
            lorem amet.
          </p>
      </v-col>
      <v-col cols="12" sm="6" md="5">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Route meta
export default {
  routeMeta: {
    title: "Auth Layout",
    requiresAuth: false,
    publicRoute: true,
  },
};
</script>

<script setup>
// Your setup code here
</script>

<style scoped>
/* Add some custom styling for the auth layout */
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.v-card-text {
  background: var(--v-background);
}
</style>
