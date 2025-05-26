<script setup>
import {
  GET_WEEKLY_PLAN_DETAILS,
  CHANGE_WEEKLY_PLAN_STAGE,
  MARK_TASK_COMPLETED,
} from "@/constants/apis";
import { WORK_REPORT_SUBMITTED, COMPLETED, IN_PROGRESS } from "@/constants/keys";
import request from "@/plugins/axios";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "@/constants/routeKeys";
const route = useRoute();
const router = useRouter();
const weeklyPlan = ref({});
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
});
// Add this computed property
const totalTasks = computed(() => {
  if (!weeklyPlan.value?.projects) return 0;
  return weeklyPlan.value.projects.reduce(
    (total, project) => total + (project.tasks?.length || 0),
    0
  );
});
const submitWeeklyPlanLoading = ref(false);
const submitWeeklyPlan = async () => {
  submitWeeklyPlanLoading.value = true;
  try {
    const res = await request.patch(
      CHANGE_WEEKLY_PLAN_STAGE.replace(
        ":weekly_plan_id",
        route.params.weekly_plan_id
      ),
      {
        plan_stage_status: "Plan Submitted",
      }
    );
    router.push({ name: ROUTES.WEEKLY_PLANS.name });
  } catch (error) {
    console.log(error);
  } finally {
    submitWeeklyPlanLoading.value = false;
  }
};
const loadingStatusChangeId = ref(null);
const handleMarkCompleted = async (task) => {
  loadingStatusChangeId.value = task.id;
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
    loadingStatusChangeId.value = null;
  }
};
const handleMarkInProgress = async (task) => {
  loadingStatusChangeId.value = task.id;
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
    loadingStatusChangeId.value = null;
  }
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h5 class="text-h5 font-weight-bold">
         Weekly Plan 🚀
        </h5>
        <p class="text-subtitle-2 text-medium-emphasis">
          {{ weeklyPlan.week }} ({{ weeklyPlan.stage }})
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card variant="flat" class="rounded-lg" :loading="loadingWeeklyPlan">
          <v-card-title>
            <div class="d-flex align-center justify-space-between">
              <div>
                {{ weeklyPlan.week }}
                <span class="bg-count rounded-xl px-2">{{ totalTasks }}</span>
              </div>
              <v-btn
              v-if="weeklyPlan.stage !== WORK_REPORT_SUBMITTED"
                size="small"
                icon="mdi-pencil-outline"
                variant="text"
                color="primary"
                @click="
                  router.push({
                    name: ROUTES.EDIT_WEEKLY_PLAN.name,
                    params: { weekly_plan_id: weeklyPlan.id },
                  })
                "
                :loading="submitWeeklyPlanLoading"
              >
              </v-btn>
            </div>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
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
              <v-list-item v-for="task in project.tasks" :key="task.id">
                <TaskCard
                  :task="task"
                  :group_id="task.group_id"
                  :project_id="project.id"
                  movable
                >
                  <template #actions="{ task }" v-if="weeklyPlan.stage !== WORK_REPORT_SUBMITTED">
                    <v-btn
                      v-if="task.task_status !== COMPLETED"
                      :loading="loadingStatusChangeId === task.id"
                      :disabled="loadingStatusChangeId === task.id"
                      variant="outlined"
                      color="success"
                      size="small"
                      rounded="lg"
                      @click="handleMarkCompleted(task)"
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
                      @click="handleMarkInProgress(task)"
                    >WIP</v-btn>
                  </template>
                </TaskCard>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions v-if="weeklyPlan?.projects?.length">
            <label class="text-subtitle-2 text-medium-emphasis">
              <v-icon icon="mdi-information"></v-icon> If any incompleted task
              is there, they will be automatically moved to pending
              tasks.</label
            >
            <v-spacer></v-spacer>
            <!-- <v-btn
              variant="flat"
              color="primary"
              @click="submitWeeklyPlan"
              :loading="submitWeeklyPlanLoading"
              >Submit</v-btn
            > -->
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped></style>
