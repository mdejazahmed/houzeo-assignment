<template>
  <div>
    <div class="d-flex align-center justify-space-between gap-2">
      <div class="text-subtitle-2">
        {{ props.project.project_name }}
      </div>
      <v-btn
        icon="mdi-pencil-minus-outline"
        variant="text"
        size="small"
        @click="emit('edit', props.project)"
      ></v-btn>
    </div>

    <v-card
      height="192"
      class="rounded-lg"
      :to="{
        name: ROUTES.PROJECT.name,
        params: { project_id: props.project.id },
      }"
    >
      <v-card-title :title="props.project.project_name">
        <div class="d-flex align-center gap-2 justify-space-between">
          <v-progress-linear
            color="green"
            height="10"
            model-value="10"
            rounded
          ></v-progress-linear>
          <span class="text-subtitle-2">10%</span>
        </div>
      </v-card-title>
    
      <v-card-text>
        
        <div class="border-dashed pa-2 rounded-lg d-flex flex-column gap-2" >
          <p class="text-medium-emphasis text-truncate">
            {{ props.project.description }}
          </p>
          <div class="d-flex align-center gap-2">
            <v-avatar
              v-for="user in props.project.team_members"
              :key="user.id"
              :color="getColor(user.email)"
              size="x-small"
              class="text-white"
            >
              {{ user.email[0].toUpperCase() }}
            </v-avatar>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ROUTES } from "@/constants/routeKeys";
const props = defineProps({
  project: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["edit"]);
const getColor = (email) => {
  const colors = [
    "red",
    "pink",
    "purple",
    "deep-purple",
    "indigo",
    "blue",
    "light-blue",
    "cyan",
    "teal",
    "green",
    "light-green",
    "lime",
    "yellow",
    "amber",
    "orange",
    "deep-orange",
    "brown",
    "blue-grey",
    "red-darken-1",
    "pink-darken-1",
    "purple-darken-1",
    "indigo-darken-1",
    "blue-darken-1",
    "teal-darken-1",
    "green-darken-1",
  ];
  return colors[email.length % colors.length];
};
</script>
<style scoped>
.border-dashed {
  border: 1px dashed #bfcfda;
}
.v-progress-linear:deep(.v-progress-linear__determinate) {
  
  background: linear-gradient(90deg, #35D0AF 0%, #6EFEB3 100%);


}
</style>
