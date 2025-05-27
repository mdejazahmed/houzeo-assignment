<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4" lg="6">
        <h5 class="text-h5">Hello, {{ user.name }} 👋</h5>
        <p class="text-subtitle-2 text-medium-emphasis">
          Keep it up and complete today’s tasks to achieve the highest streak.
        </p>
      </v-col>
      <v-col cols="12" sm="6" md="4" lg="6" class="d-flex align-center justify-end gap-2">
        <v-btn
          icon="mdi-magnify"
          variant="outlined"
          color="primary"
          size="small"
        ></v-btn>
        <v-btn
          variant="flat"
          color="primary"
          rounded
          @click="createProject"
          >Add Project</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="project in projects"
        :key="project.id"
        cols="12"
        sm="6"
        md="4"
        lg="4"
      >
        <ProjectCard :project="project" @edit="editProject" />
      </v-col>
    </v-row>
  

    <AddEditProjectModal
      v-model="addProjectDialog.show"
      @close="addProjectDialog.show = false"
    :title="addProjectDialog.title"
    :data="addProjectDialog.data"
      @success="getProjectsList"
    />
  </v-container>
</template>

<script setup>
// Your setup code here
import { reactive, ref } from "vue";
import AddEditProjectModal from "@/components/dialogs/AddEditProjectModal.vue";
import ProjectCard from "@/components/cards/ProjectCard.vue";
import request from "@/plugins/axios";
import { GET_PROJECTS_LIST } from "@/constants/apis";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore()
const { user } = userStore
const addProjectDialog = reactive({
  show: false,
  title: "Create Project",
});

const createProject = () => {
  addProjectDialog.show = true;
  addProjectDialog.title = "Create Project";
  addProjectDialog.data = {};
};
const projects = ref([]);
const getProjectsList = async () => {
  try {
    const res = await request.get(GET_PROJECTS_LIST);
    projects.value = res.data?.detail;
  } catch (error) {
    console.log(error);
  }
};
getProjectsList();

const editProject = (project) => {
  addProjectDialog.title = "Edit Project";
  addProjectDialog.data = project;
  addProjectDialog.show = true;
};
</script>
