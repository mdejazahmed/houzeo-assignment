<script setup>
import { ref } from "vue";
import GroupCard from "@/components/cards/GroupCard.vue";
import {
  GET_PROJECTS_LIST,
  GET_PROJECT_PENDING_TASKS,
  GET_WEEKLY_PLAN_DETAILS,
  MOVE_TASK,
  REMOVE_TASK,
} from "@/constants/apis";
import request from "@/plugins/axios";
import AddEditTask from "@/components/dialogs/AddEditTask.vue";
import { useRoute } from "vue-router";
const route = useRoute();
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
const addEditTaskDialog = reactive({
  show: false,
});
const getProjectList = async () => {
  try {
    const res = await request.get(GET_PROJECTS_LIST);
    projectsList.value = res.data?.detail || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    projectsList.value = [];
  }
};
const getPendingTasks = async (selectedProject) => {
  console.log("project_id", selectedProject?.id);

  try {
    const res = await request.get(
      GET_PROJECT_PENDING_TASKS.replace(":project_id", selectedProject?.id)
    );
    project.value = res.data?.detail;
    groups.value = project.value?.project_groups || [];
  } catch (error) {
    console.log(error);
  }
};
const weeklyPlan = ref({});
const moveTaskLoading = ref(false);
const removeTaskLoading = ref(false);
const getWeeklyPlanDetails = async () => {
  try {
    const res = await request.get(
      GET_WEEKLY_PLAN_DETAILS.replace(
        ":weekly_plan_id",
        route.params.weekly_plan_id
      )
    );
    weeklyPlan.value = res.data?.detail;
  } catch (error) {
    console.log(error);
  }
};
onMounted(async () => {
  await getProjectList();
  selectedProject.value = projectsList.value[0];
  await getPendingTasks(selectedProject.value);
  getWeeklyPlanDetails();
});
const moveTask = async ({ weekly_plan_id, task_id, group_id, project_id }) => {
  moveTaskLoading.value = true;
  try {
    const res = await request.patch(MOVE_TASK, {
      weekly_plan_id,
      task_id,
      group_id,
      project_id,
    });
    // remove task from pending tasks
    const moveItemGroupIndex=groups.value.findIndex((group)=>group.id===group_id)
    const moveItemIndex=groups.value[moveItemGroupIndex].pending_tasks.findIndex((task)=>task.id===task_id)
    groups.value[moveItemGroupIndex].pending_tasks.splice(moveItemIndex,1)
    getWeeklyPlanDetails();
  } catch (error) {
    console.log(error);
  } finally {
    moveTaskLoading.value = false;
  }
};
const removeTask = async ({
  weekly_plan_id,
  task_id,
  group_id,
  project_id,
}) => {
  removeTaskLoading.value = true;
  try {
    const res = await request.patch(REMOVE_TASK, {
      weekly_plan_id,
      task_id,
      group_id,
      project_id,
    });
const removedTask=res.data?.detail.task
    // remove task from weekly plan
    const projectIndex=weeklyPlan.value.projects.findIndex((project)=>project.project_id===project_id)
    const taskIndex=weeklyPlan.value.projects[projectIndex].tasks.findIndex((task)=>task.id===task_id)
   weeklyPlan.value.projects[projectIndex].tasks.splice(taskIndex,1)
    // add task to pending tasks
    if(res.data?.detail.project.project_id==selectedProject.value.id){
      const groupIndex=groups.value.findIndex((group)=>group.id===group_id)
      groups.value[groupIndex].pending_tasks.push(removedTask)
    }
    
    
    getWeeklyPlanDetails();
  } catch (error) {
    console.log(error);
  } finally {
    removeTaskLoading.value = false;
  }
};
</script>

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
        <v-card variant="flat" class="rounded-lg">
          <v-card-title class="d-flex align-center justify-space-between gap-2">
            <label
              class="text-subtitle-2 text-medium-emphasis"
              for="select_project"
              >Select Project:
            </label>
            <v-autocomplete
              name="select_project"
              id="select_project"
              v-model="selectedProject"
              :items="projectsList"
              return-object
              item-title="project_name"
              variant="outlined"
              hide-details
              density="compact"
              @update:modelValue="getPendingTasks"
            />
          </v-card-title>
        </v-card>

        <GroupCard
          variant="flat"
          v-for="group in project.project_groups"
          :key="group.id"
          :group="group"
          :project_id="selectedProject?.id"
          :showProgress="false"
          class="mb-2 rounded-lg"
        >
          <v-list>
            <v-list-item v-for="task in group.pending_tasks" :key="task.id">
              <TaskCard
                :task="task"
                :group_id="group.id"
                :project_id="selectedProject?.id"
                :movable="task.flag_can_move_task"
                editable
              >
                <template #actions="{ task }">
                  <v-btn
                    :loading="moveTaskLoading"
                    :disabled="moveTaskLoading"
                    variant="flat"
                    size="small"
                    rounded="lg"
                    color="primary"
                    @click="
                      moveTask({
                        weekly_plan_id: route.params.weekly_plan_id,
                        task_id: task.id,
                        group_id: group.id,
                        project_id: selectedProject?.id,
                      })
                    "
                    >Move</v-btn
                  >
                </template>
              </TaskCard>
            </v-list-item>
            <AddEditTask
              v-if="addEditTaskDialog.show"
              @close="addEditTaskDialog.show = false"
              :project_id="selectedProject?.id"
              :group_id="group.id"
              @success="getPendingTasks(selectedProject)"
            />
            <v-list-item>
              <v-btn
                v-if="!addEditTaskDialog.show"
                variant="outlined"
                size="small"
                rounded
                @click="addEditTaskDialog.show = true"
                >Add a task</v-btn
              >
            </v-list-item>
          </v-list>
        </GroupCard>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card variant="flat" class="rounded-lg">
          <v-card-title> {{ weeklyPlan.week }} </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-for="project in weeklyPlan.projects" :key="project.id">
              <p class="text-h6">{{ project.project_name }}</p>

              <v-list-item v-for="task in project.tasks" :key="task.id">
                <TaskCard
                  :task="task"
                  :group_id="task.group_id"
                  :project_id="project.id"
                  movable
                >
                  <template #actions="{ task }">
                    <v-btn
                      :loading="removeTaskLoading"
                      :disabled="removeTaskLoading"
                      variant="flat"
                      color="error"
                      size="small"
                      rounded="lg"
                      @click="
                        removeTask({
                          weekly_plan_id: route.params.weekly_plan_id,
                          task_id: task.id,
                          group_id: task.project_group?.id,
                          project_id: project.project_id,
                        })
                      "
                      >Remove</v-btn
                    >
                  </template>
                </TaskCard>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped></style>
