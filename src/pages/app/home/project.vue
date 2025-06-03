<script setup>
import { reactive } from "vue";
import { ref } from "vue";
import request from "@/plugins/axios";
import { GET_PROJECT } from "@/constants/apis";
import { useRoute, useRouter } from "vue-router";
import AddEditGroupModal from "@/components/dialogs/AddEditGroupModal.vue";
import TaskCard from "@/components/cards/TaskCard.vue";
import {ROUTES} from '@/constants/routeKeys'
import {
  COMPLETED,
  IN_PROGRESS,
  TODAY_TASKS,
  WEEK_ALL_TASKS,
} from "@/constants/keys";
import {
  GET_WEEKLY_PLAN_OF_PROJECT,
  MARK_TASK_COMPLETED,
  MOVE_TASK,
  REMOVE_TASK,
} from "@/constants/apis";
import NoTasks from "@/components/emptyStates/NoTasks.vue";
const route = useRoute();
const router = useRouter();
const addGroupDialog = reactive({
  show: false,
  title: "Add Group",
  data: null,
});
const addMembersDialog = reactive({
  show: false,
  title: "Add Team Members",
  data: null,
});
const project = ref({});
const openTaskDialog = reactive({
  show: false,
  id: null,
});
const closeTaskDialog = () => {
  openTaskDialog.show = false;
  openTaskDialog.id = null;
};
const getProjectDetail = async () => {
  try {
    const res = await request.get(
      GET_PROJECT.replace(":project_id", route.params.project_id)
    );
    project.value = res.data?.detail;
  } catch (error) {
    console.log(error);
  }
};
getProjectDetail();
const loadingStatusChangeId = ref(null);
const weeklyPlan = ref({});
const task_list_type = ref("week_all_tasks");
const getWeeklyPlanDetails = async (task_list_type = "week_all_tasks") => {
  try {
    const res = await request.get(GET_WEEKLY_PLAN_OF_PROJECT.replace(":project_id", route.params.project_id), {
      params: {
        task_list_type,
      },
    });
    weeklyPlan.value = res.data?.detail;
  } catch (error) {
    console.log(error);
  }
};
getWeeklyPlanDetails();
const handleMarkCompleted = async (task, taskIndex) => {
  loadingStatusChangeId.value = task.id;
  try {
    const res = await request.patch(
      MARK_TASK_COMPLETED.replace(":task_id", task.id),
      {
        task_status: COMPLETED,
      }
    );
    const completedTask = { ...task, task_status: COMPLETED };
    weeklyPlan.value.wip_tasks.splice(taskIndex, 1);
    weeklyPlan.value.completed_tasks_count++;
    weeklyPlan.value.completed_tasks.unshift(completedTask);
  } catch (error) {
    console.log(error);
  } finally {
    loadingStatusChangeId.value = null;
  }
};
const handleMarkInProgress = async (task, taskIndex) => {
  loadingStatusChangeId.value = task.id;
  try {
    const res = await request.patch(
      MARK_TASK_COMPLETED.replace(":task_id", task.id),
      {
        task_status: IN_PROGRESS,
      }
    );
    const inProgressTask = { ...task, task_status: IN_PROGRESS };
    weeklyPlan.value.completed_tasks.splice(taskIndex, 1);
    weeklyPlan.value.completed_tasks_count--;
    weeklyPlan.value.wip_tasks.unshift(inProgressTask);
  } catch (error) {
    console.log(error);
  } finally {
    loadingStatusChangeId.value = null;
  }
};
const moveTask = async (task, weekly_plan_id) => {
  const { id: task_id, group_id, project_id } = task;
  task.loading = true;
  try {
    const res = await request.patch(MOVE_TASK, {
      weekly_plan_id,
      task_id,
      group_id,
      project_id,
    });
    task.loading = false;

    // remove task from pending tasks
    const moveItemGroupIndex = project.value.project_groups.findIndex(
      (group) => group.id === group_id
    );
    //get index of task in pending tasks
    const moveItemIndex = project.value.project_groups[
      moveItemGroupIndex
    ].pending_tasks.findIndex((task) => task.id === task_id);
    //remove task from pending tasks
    project.value.project_groups[moveItemGroupIndex].pending_tasks.splice(
      moveItemIndex,
      1
    );
    //add task to wip tasks
    let moveItem = res.data?.detail;
    console.log(moveItem.project_group);

    moveItem = {
      ...task,
      project: {
        id: moveItem.project?.project_id,
        project_name: moveItem.project?.project_name,
      },
      project_group: {
        id: moveItem.project_group?.project_group_id,
        project_group_name: moveItem.project_group?.project_group_name,
      },
    };
    console.log(moveItem);

    weeklyPlan.value.wip_tasks.unshift(moveItem);
  } catch (error) {
   
    console.log(error);
  } finally {
    task.loading = false;
  }
};
const removeTask = async (task, weekly_plan_id) => {
  const task_id = task.id;
  const group_id = task.project_group.id;
  const project_id = task.project.id;
  task.loading = true;
  try {
    const res = await request.patch(REMOVE_TASK, {
      weekly_plan_id,
      task_id,
      group_id,
      project_id,
    });
    //get index of task in wip tasks
    const removedTaskIndex = weeklyPlan.value.wip_tasks.findIndex(
      (task) => task.id === task_id
    );
    //remove task from wip tasks
    weeklyPlan.value.wip_tasks.splice(removedTaskIndex, 1);
    //add task to pending tasks
    const projectGroupIndex = project.value.project_groups.findIndex(
      (group) => group.id === group_id
    );
    project.value.project_groups[projectGroupIndex].pending_tasks.unshift(task);
  } catch (error) {
    console.log(error);
  } finally {
    task.loading = false;
  }
};
</script>

<template>
  <v-row
    class="d-flex justify-space-between bg-background"
    style="position: sticky; top: 0; z-index: 999"
  >
    <v-col cols="12" sm="6" md="4" lg="6" class="d-flex gap-2">
      <v-icon
        size="30"
        icon="mdi-arrow-left-circle-outline"
        @click="router.back()"
      ></v-icon>
      <div>
        <h5 class="text-h5 font-weight-bold">{{ project.project_name }} 🚀</h5>
        <p class="text-subtitle-2 text-medium-emphasis">
          {{ project.description }}
        </p>
      </div>
    </v-col>
    <v-col
      cols="12"
      sm="6"
      md="4"
      lg="6"
      class="d-flex align-center justify-end gap-2"
    >
      <v-btn
        icon="mdi-magnify"
        variant="outlined"
        color="primary"
        size="small"
      ></v-btn>
      <v-btn
        icon="mdi-history"
        variant="outlined"
        color="primary"
        size="small"
       v-tooltip:bottom="'History'"
       :to="ROUTES.PROJECT_HISTORY.path.replace(':project_id', project.id)"
      ></v-btn>
      <v-btn
        variant="outlined"
        color="primary"
        rounded
        @click="
          (addMembersDialog.show = true),
            (addMembersDialog.data = {
              project_id: project.id,
              team_members: project.team_members,
            })
        "
        >Add Team Members</v-btn
      >
      <v-btn
        variant="flat"
        color="primary"
        rounded
        @click="addGroupDialog.show = true"
        >Add Group</v-btn
      >
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="6">
      <div
        class="mb-2 rounded-lg"
        v-for="(group, groupIndex) in project.project_groups"
        variant="flat"
      >
        <v-card-title
          class="bg-surface rounded-t-lg"
          style="position: sticky; top: 64px; z-index: 999"
        >
          {{ group.group_name }}
        </v-card-title>
        <v-card-text class="bg-surface rounded-b-lg">
          <TaskCard
            v-for="(task, taskIndex) in group?.pending_tasks"
            :key="task.id"
            :editable="true"
            :task="task"
            :group_id="group.id"
            :project_id="project.id"
            :movable="task.flag_can_move_task"
            @success="
              (updatedTask) => {
                Object.assign(task, updatedTask);
              }
            "
            :taskIndex="taskIndex"
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
                  moveTask(
                    { ...task, group_id: group.id, project_id: project.id },
                    weeklyPlan.weekly_plan_id
                  )
                "
                >Move</v-btn
              >
            </template>
          </TaskCard>
          <AddEditTask
            v-if="openTaskDialog.show && openTaskDialog.id === group.id"
            @close="closeTaskDialog"
            :project_id="project.id"
            :group_id="group.id"
            @success="
              (task) => {
                group?.pending_tasks.push(task);
              }
            "
          />
          <v-btn
            v-if="!openTaskDialog.show || openTaskDialog.id !== group.id"
            variant="outlined"
            size="small"
            rounded
            @click="
              () => {
                openTaskDialog.show = true;
                openTaskDialog.id = group.id;
              }
            "
            >Add a task</v-btn
          >
        </v-card-text>
      </div>
    </v-col>
    <v-col cols="6">
      <div style="position: sticky; top: 64px; z-index: 999" >
        <v-card-title class="bg-surface rounded-t-lg" >
          Weekly Plan ({{ weeklyPlan.weekly_plan }})
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="bg-surface">
          <NoTasks v-if="!weeklyPlan?.wip_tasks?.length"/>
          <TaskCard
            v-else
            v-for="(task, taskIndex) in weeklyPlan.wip_tasks"
            :key="task.id"
            :task="task"
            :index="taskIndex"
            :group_id="task.project_group.id"
            :project_id="task.project.id"
            :movable="task.flag_can_move_task"
            :taskIndex="taskIndex"
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
                @click="handleMarkCompleted(task, taskIndex)"
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
                @click="removeTask(task, weeklyPlan.weekly_plan_id)"
                >Remove</v-btn
              >
            </template>
          </TaskCard>
        </v-card-text>
      </div>
    </v-col>
  </v-row>
  <AddEditGroupModal
    v-model="addGroupDialog.show"
    @close="addGroupDialog.show = false"
    :title="addGroupDialog.title"
    :data="addGroupDialog.data"
    @success="(addGroupDialog.show = false), getProjectDetail()"
  />
  <AddEditMembersModal
    v-model="addMembersDialog.show"
    @close="addMembersDialog.show = false"
    :title="addMembersDialog.title"
    :data="addMembersDialog.data"
    @success="getProjectDetail"
  />
</template>
<style scoped lang="scss">

</style>