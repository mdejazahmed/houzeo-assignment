<template>
  <v-container>
    <v-row>
      <v-col>
        <h5 class="text-h5 font-weight-bold">Create Weekly Plan 🚀</h5>
        <p class="text-subtitle-2 text-medium-emphasis">Create Weekly Plan</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" class="d-flex flex-column gap-2">
        <v-card>
          <v-card-text>
            <v-select
              v-model="selectedProject"
              :items="projectsList"
              return-object
              item-title="project_name"
              item-value="id"
              label="Select Project"
              variant="outlined"
              hide-details
              density="compact"
              @update:modelValue="getProjectDetail"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text>
            <GroupCard
              v-for="group in project.project_groups"
              :key="group.id"
              :group="group"
              :project_id="selectedProject?.id"
              class="mb-2"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6"> </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import GroupCard from "@/components/cards/GroupCard.vue";
import { GET_PROJECTS_LIST,GET_PROJECT } from "@/constants/apis";
import request from "@/plugins/axios";
const project = ref({});
const groups = ref([
  {
    id: 1,
    group_name: "Group 1",
    task_counts: {
      total_tasks: 10,
      completed_tasks: 5,
    },
    pending_tasks: [],
    wip_tasks: [],
    completed_tasks: [],
  },
]);
const projectsList = ref([]);
const selectedProject = ref(null);
const getProjectList = async () => {
  try {
    const res = await request.get(GET_PROJECTS_LIST);
    projectsList.value = res.data?.detail || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    projectsList.value = [];
  }
};
const getProjectDetail = async ({id}) => {
  try {
    const res = await request.get(
      GET_PROJECT.replace(":project_id", id)
    );
    project.value = res.data?.detail;
    groups.value = project.value?.project_groups || [];
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await getProjectList();
});
</script>

<style lang="scss" scoped></style>
