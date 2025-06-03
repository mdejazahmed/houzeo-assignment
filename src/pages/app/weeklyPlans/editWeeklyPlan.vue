<script setup>
import GroupCard from "@/components/cards/GroupCard.vue";
import {
  GET_PROJECTS_LIST,
  GET_PROJECT_PENDING_TASKS,
  GET_WEEKLY_PLAN_DETAILS,
  MOVE_TASK,
  REMOVE_TASK,
  CHANGE_WEEKLY_PLAN_STAGE,
  MARK_TASK_COMPLETED,
} from "@/constants/apis";
import {
  PENDING,
  DRAFT,
  PLAN_SUBMITTED,
  WORK_REPORT_SUBMITTED,
  COMPLETED,
  IN_PROGRESS,
} from "@/constants/keys";
import request from "@/plugins/axios";
import AddEditTask from "@/components/dialogs/AddEditTask.vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "@/constants/routeKeys";
const route = useRoute();
const router = useRouter();
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
const loadingProjectList = ref(false);
const getProjectList = async () => {
  loadingProjectList.value = true;
  try {
    const res = await request.get(GET_PROJECTS_LIST);
    projectsList.value = res.data?.detail || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    projectsList.value = [];
  } finally {
    loadingProjectList.value = false;
  }
};
const loadingPendingTasks = ref(false);
const getPendingTasks = async (selectedProject) => {
  loadingPendingTasks.value = true;

  try {
    const res = await request.get(
      GET_PROJECT_PENDING_TASKS.replace(":project_id", selectedProject?.id)
    );
    project.value = res.data?.detail;
    groups.value = project.value?.project_groups || [];
  } catch (error) {
    console.log(error);
  } finally {
    loadingPendingTasks.value = false;
  }
};
const weeklyPlan = ref({});
const moveTaskLoading = ref(false);
const removeTaskLoading = ref(false);
const loadingWeeklyPlan = ref(false);
const getWeeklyPlanDetails = async () => {
  loadingWeeklyPlan.value = true;
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
  } finally {
    loadingWeeklyPlan.value = false;
  }
};
onMounted(async () => {
  getWeeklyPlanDetails();
  await getProjectList();
  selectedProject.value = projectsList.value[0];
  await getPendingTasks(selectedProject.value);
});
const moveTask = async (
  task,
  { weekly_plan_id, task_id, group_id, project_id }
) => {
  task.loading = true;
  try {
    const res = await request.patch(MOVE_TASK, {
      weekly_plan_id,
      task_id,
      group_id,
      project_id,
    });
    // remove task from pending tasks
    const moveItemGroupIndex = groups.value.findIndex(
      (group) => group.id === group_id
    );
    const moveItemIndex = groups.value[
      moveItemGroupIndex
    ].pending_tasks.findIndex((task) => task.id === task_id);
    groups.value[moveItemGroupIndex].pending_tasks.splice(moveItemIndex, 1);
    getWeeklyPlanDetails();
  } catch (error) {
    console.log(error);
  } finally {
    task.loading = false;
  }
};
const removeTask = async (
  task,
  { weekly_plan_id, task_id, group_id, project_id }
) => {
  task.loading = true;
  try {
    const res = await request.patch(REMOVE_TASK, {
      weekly_plan_id,
      task_id,
      group_id,
      project_id,
    });
    const removedTask = res.data?.detail.task;
    // remove task from weekly plan
    const projectIndex = weeklyPlan.value.projects.findIndex(
      (project) => project.project_id === project_id
    );
    const taskIndex = weeklyPlan.value.projects[projectIndex].tasks.findIndex(
      (task) => task.id === task_id
    );
    weeklyPlan.value.projects[projectIndex].tasks.splice(taskIndex, 1);
    // add task to pending tasks
    if (res.data?.detail.project.project_id == selectedProject.value.id) {
      const groupIndex = groups.value.findIndex(
        (group) => group.id === group_id
      );
      groups.value[groupIndex].pending_tasks.unshift(removedTask);
    }

    getWeeklyPlanDetails();
  } catch (error) {
    console.log(error);
  } finally {
    task.loading = false;
  }
};
const handleMarkCompleted = async (task) => {
  task.status_change_loading = true;
  try {
    const res = await request.patch(
      MARK_TASK_COMPLETED.replace(":task_id", task.id),
      {
        task_status: COMPLETED,
      }
    );
    task.task_status = COMPLETED;
  } catch (error) {
    console.log(error);
  } finally {
    task.status_change_loading = false;
  }
};
const handleMarkInProgress = async (task) => {
  task.status_change_loading = true;
  try {
    const res = await request.patch(
      MARK_TASK_COMPLETED.replace(":task_id", task.id),
      {
        task_status: IN_PROGRESS,
      }
    );
    task.task_status = IN_PROGRESS;
  } catch (error) {
    console.log(error);
  } finally {
    task.status_change_loading = false;
  }
};
// Add this computed property
const totalTasks = computed(() => {
  if (!weeklyPlan.value?.projects) return 0;
  return weeklyPlan.value.projects.reduce(
    (total, project) => total + (project.tasks?.length || 0),
    0
  );
});
const submitLoading = ref(false);
const submit = async (stage) => {
  submitLoading.value = true;
  try {
    const res = await request.patch(
      CHANGE_WEEKLY_PLAN_STAGE.replace(
        ":weekly_plan_id",
        route.params.weekly_plan_id
      ),
      {
        plan_stage_status: stage,
      }
    );
    router.push({
      name: ROUTES.WEEKLY_PLANS.name,
      query: { tab: stage },
    });
  } catch (error) {
    console.log(error);
  } finally {
    submitLoading.value = false;
  }
};
const totalHours = computed(() => {
  if (!weeklyPlan.value?.projects) return 0;
  return weeklyPlan.value.projects.reduce(
    (total, project) =>
      total +
      (project.tasks?.reduce(
        (total, task) => total + parseInt(task.duration),
        0
      ) || 0),
    0
  );
});
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center gap-4">
      <v-icon
        size="30"
        icon="mdi-arrow-left-circle-outline"
        @click="router.back()"
      ></v-icon>

      <h5 class="text-h5 font-weight-bold">Edit Weekly Plan 🚀</h5>
      <p class="text-subtitle-2 text-medium-emphasis">
        {{ weeklyPlan.week }} ({{ weeklyPlan.stage }})
      </p>
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
            :loading="loadingProjectList"
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
      <v-skeleton-loader
        v-if="loadingPendingTasks"
        type="list-item-two-line"
      ></v-skeleton-loader>

      <div
        v-else
        v-for="group in project.project_groups"
        :key="group.id"
      >
      <h6 class="text-h6 font-weight-bold pa-2">
        {{ group.group_name }}
      </h6>
      <v-card-text class="bg-surface rounded-lg ">
        <TaskCard
          v-for="(task, index) in group.pending_tasks"
          :key="task.id"
          :task="task"
          :group_id="group.id"
          :project_id="selectedProject?.id"
          :movable="task.flag_can_move_task"
          editable
          @success="
            (updatedTask) => {
              Object.assign(task, updatedTask);
            }
          "
          :taskIndex="index"
        >
          <template #actions="{ task }">
            <v-btn
              :loading="task.loading"
              :disabled="task.loading"
              variant="flat"
              size="small"
              rounded="lg"
              color="primary"
              @click="
                moveTask(task, {
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
        <AddEditTask
          v-if="addEditTaskDialog.show"
          @close="addEditTaskDialog.show = false"
          :project_id="selectedProject?.id"
          :group_id="group.id"
          @success="
            (task) => {
              group.pending_tasks.push(task);
            }
          "
        />
        <v-btn
          v-if="!addEditTaskDialog.show"
          variant="outlined"
          size="small"
          rounded
          @click="addEditTaskDialog.show = true"
          >Add a task</v-btn
        >
      </v-card-text>
        
      </div>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card
        variant="flat"
        class="rounded-lg"
        :loading="loadingWeeklyPlan"
        style="top: 16px; position: sticky"
      >
        <v-card-title class="d-flex align-center justify-space-between gap-2">
          <div>
            {{ weeklyPlan.week }}
            <span class="bg-count rounded-xl px-2">{{ totalTasks }}</span>
          </div>
          <div>
            <label class="text-subtitle-2 text-medium-emphasis"
              >Total Duration: {{ totalHours }} Hours</label
            >
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text
          style="
            min-height: calc(100vh - 160px);
            max-height: calc(100vh - 120px);
            overflow-y: auto;
          "
        >
          <div
            v-if="!weeklyPlan?.projects?.length"
            class="d-flex flex-column align-center justify-center"
          >
            <h6 class="text-h6 text-primary">Move tasks here</h6>
            <v-img
              src="@/assets/emptyStates/no_tasks.svg"
              width="50%"
              cover
            ></v-img>
            <p class="text-subtitle-2 text-medium-emphasis">
              Currently there are no tasks for this week
            </p>
          </div>
          <v-list
            v-else
            v-for="project in weeklyPlan.projects"
            :key="project.id"
          >
            <p class="text-h6">{{ project.project_name }}</p>
            <v-list-item v-for="(task, index) in project.tasks" :key="task.id">
              <TaskCard
                :task="task"
                :group_id="task.project_group?.id"
                :project_id="project.project_id"
                movable
                :taskIndex="index"
              >
                <template #actions="{ task }">
                  <v-btn
                    :loading="task.status_change_loading"
                    :disabled="task.status_change_loading"
                    v-if="task.task_status !== 'Completed'"
                    variant="outlined"
                    color="success"
                    size="small"
                    rounded="lg"
                    @click="handleMarkCompleted(task)"
                    >Mark Completed</v-btn
                  >
                  <div v-else>
                    <label class="text-subtitle-2">Move to: </label>
                    <v-btn
                      :loading="task.status_change_loading"
                      :disabled="task.status_change_loading"
                      variant="tonal"
                      color="warning"
                      size="small"
                      rounded="lg"
                      @click="handleMarkInProgress(task)"
                      >WIP</v-btn
                    >
                  </div>
                  <v-btn
                    v-if="task.task_status !== COMPLETED"
                    :loading="task.loading"
                    :disabled="task.loading"
                    variant="flat"
                    color="error"
                    size="small"
                    rounded="lg"
                    @click="
                      removeTask(task, {
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
        <v-card-actions v-if="weeklyPlan?.projects?.length">
          <label class="text-subtitle-2 text-medium-emphasis">
            <v-icon icon="mdi-information"></v-icon> If plan not submitted
            before Friday, your weekly plan will move missed plans list.</label
          >
          <v-spacer></v-spacer>
          <v-btn
            v-if="weeklyPlan.stage == PENDING || weeklyPlan.stage == DRAFT"
            variant="flat"
            color="primary"
            @click="submit(PLAN_SUBMITTED)"
            :loading="submitLoading"
            :disabled="submitLoading"
            rounded="lg"
            >Submit Weekly Plan</v-btn
          >
          <v-btn
            v-if="weeklyPlan.stage == PLAN_SUBMITTED"
            variant="flat"
            color="primary"
            @click="submit(WORK_REPORT_SUBMITTED)"
            :loading="submitLoading"
            :disabled="submitLoading"
            rounded="lg"
            >Submit Work Report</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped></style>
