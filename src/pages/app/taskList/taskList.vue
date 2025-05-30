<script setup>
import { GET_TASK_LIST, MARK_TASK_COMPLETED } from "@/constants/apis";
import request from "@/plugins/axios";
import TaskCard from "@/components/cards/TaskCard.vue";
import {
  COMPLETED,
  IN_PROGRESS,
  TODAY_TASKS,
  WEEK_ALL_TASKS,
} from "@/constants/keys";
const loading = ref(false);
const loadingStatusChangeId = ref(null);
const tasks = ref({});
const task_list_type = ref("week_all_tasks");
const getprojectList = async () => {
  
  loading.value = true;
  try {
    const res = await request.get(GET_TASK_LIST, {
      params: {
        task_list_type: task_list_type.value,
      },
    });
    tasks.value = res.data?.detail;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
getprojectList();
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
    tasks.value.wip_tasks.splice(taskIndex, 1);
    tasks.value.completed_tasks_count++;
    tasks.value.completed_tasks.unshift(completedTask);
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
    tasks.value.completed_tasks.splice(taskIndex, 1);
    tasks.value.completed_tasks_count--;
    tasks.value.wip_tasks.unshift(inProgressTask);
  } catch (error) {
    console.log(error);
  } finally {
    loadingStatusChangeId.value = null;
  }
};
const progress = computed(() => {
  return (
    (tasks.value?.completed_tasks_count / tasks.value?.total_tasks_count) * 100
  );
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-space-between gap-2">
        <h5 class="text-h5 font-weight-bold">Task List 🚀</h5>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-magnify"
          variant="outlined"
          color="primary"
          size="small"
        ></v-btn>
        <v-btn variant="flat" color="primary" rounded>Add Task</v-btn>
      </v-col>
      <v-col cols="12" class="d-flex align-center justify-end gap-4">
        <span class="text-subtitle-1" :class="task_list_type === TODAY_TASKS ? 'font-weight-medium' : ''">Today’s Todos</span>
        <v-switch
          hide-details
          density="compact"
          color="primary"
          inset
          v-model="task_list_type"
          :false-value="TODAY_TASKS"
          :true-value="WEEK_ALL_TASKS"
          @update:model-value="getprojectList()"
        ></v-switch>
        <span class="text-subtitle-1" :class="task_list_type === WEEK_ALL_TASKS ? 'font-weight-medium' : ''">This Week’s Todos</span>
      </v-col>
      <v-col cols="12">
        <v-card variant="flat" rounded="lg">
          <v-card-title>
            <div class="d-flex align-center gap-2 justify-space-between">
              <v-progress-linear
                height="10"
                :model-value="progress"
                rounded
              ></v-progress-linear>
              <span class="text-subtitle-2"
                >{{ tasks.completed_tasks_count }} /
                {{ tasks.total_tasks_count }}</span
              >
            </div>
          </v-card-title>
          <v-card-text>
            <div class="text-h6 text-warning py-4">WIP Tasks</div>
            <v-list class="rounded-lg border-sm border-dashed">
              <div
                v-if="!tasks?.wip_tasks?.length"
                class="d-flex align-center justify-center py-4 text-medium-emphasis text-h6"
              >
                There is no WIP Tasks
              </div>
              <template v-else>
                <v-list-item
                  v-for="(task, taskIndex) in tasks.wip_tasks"
                  :key="task.id"
                >
                  <TaskCard
                    :task="task"
                    :group_id="task.project_group.id"
                    :project_id="task.project.id"
                    movable
                  >
                    <template #actions="{ task }">
                      <div class="d-flex align-center gap-2">
                        <label for="">Move to: </label>

                        <v-btn
                          v-if="task.task_status !== COMPLETED"
                          :loading="loadingStatusChangeId === task.id"
                          :disabled="loadingStatusChangeId === task.id"
                          variant="outlined"
                          color="success"
                          size="small"
                          rounded="lg"
                          @click="handleMarkCompleted(task, taskIndex)"
                          >Completed</v-btn
                        >

                        <v-btn
                          v-else
                          :loading="loadingStatusChangeId === task.id"
                          :disabled="loadingStatusChangeId === task.id"
                          variant="tonal"
                          color="warning"
                          size="small"
                          rounded="lg"
                          @click="handleMarkInProgress(task, taskIndex)"
                          >WIP</v-btn
                        >
                      </div>
                    </template>
                  </TaskCard>
                </v-list-item>
              </template>
            </v-list>
            <div class="text-h6 text-success py-4">Completed Tasks</div>
            <v-list class="rounded-lg border-sm border-dashed">
              <div
                v-if="!tasks?.completed_tasks?.length"
                class="d-flex align-center justify-center py-4 text-medium-emphasis text-h6"
              >
                There is no Completed Tasks
              </div>
              <template v-else>
                <v-list-item
                  v-for="(task, taskIndex) in tasks.completed_tasks"
                  :key="task.id"
                >
                  <TaskCard
                    :task="task"
                    :group_id="task.project_group.id"
                    :project_id="task.project.id"
                    movable
                  >
                    <template #actions="{ task }">
                      <div class="d-flex align-center gap-2">
                        <label for="">Move to: </label>

                        <v-btn
                          v-if="task.task_status !== COMPLETED"
                          :loading="loadingStatusChangeId === task.id"
                          :disabled="loadingStatusChangeId === task.id"
                          variant="outlined"
                          color="success"
                          size="small"
                          rounded="lg"
                          @click="handleMarkCompleted(task, taskIndex)"
                          >Mark Completed</v-btn
                        >

                        <v-btn
                          v-else
                          :loading="loadingStatusChangeId === task.id"
                          :disabled="loadingStatusChangeId === task.id"
                          variant="tonal"
                          color="warning"
                          size="small"
                          rounded="lg"
                          @click="handleMarkInProgress(task, taskIndex)"
                          >WIP</v-btn
                        >
                      </div>
                    </template>
                  </TaskCard>
                </v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="css" scoped>
.v-progress-linear:deep(.v-progress-linear__determinate) {
  background: linear-gradient(90deg, #35d0af 0%, #6efeb3 100%);
}
.v-switch:deep(.v-switch__track) {
  height: 24px;
  min-width: 48px;
  opacity: 1;
}
.v-switch:deep(.v-switch__thumb) {
  width: 14px;
  height: 14px;
  transform: unset;
}
</style>