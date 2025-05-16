<script setup>
import { ref, reactive } from "vue";
import { GET_PROJECT_TEAMS, CREATE_TASK } from "@/constants/apis";
import request from "@/plugins/axios";
import UserChip from "@/components/chips/UserChip.vue";
import { requiredRule, requiredArrayRule } from "@/utils/formRules";
import { useRoute } from "vue-router";
import TaskCard from "@/components/cards/TaskCard.vue";
import AddEditTask from "@/components/dialogs/AddEditTask.vue";
const route = useRoute();
const props = defineProps({
  group: Object,
});
const emit = defineEmits(["success"]);

const openTaskDialog = reactive({
  show: false,
  id: null,
});

const closeTaskDialog = () => {
  openTaskDialog.show = false;
  openTaskDialog.id = null;
};
const handleCreateTask = () => {
  closeTaskDialog();
  emit("success");
};
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between gap-2">
      <div class="text-h6">
        {{ props.group?.group_name }}
      </div>
    </div>

    <v-card class="rounded-lg mt-2">
      <v-card-title :title="props.group?.name">
        <div class="d-flex align-center gap-2 justify-space-between">
          <v-progress-linear
            color="green"
            height="10"
            :model-value="
              (props.group?.task_counts.completed_tasks /
                props.group?.task_counts.total_tasks) *
              100
            "
            rounded
          ></v-progress-linear>
          <span class="text-subtitle-2"
            >{{ props.group?.task_counts.completed_tasks }} /
            {{ props.group?.task_counts.total_tasks }}</span
          >
        </div>
      </v-card-title>
      <v-card-text>
        <section>
          <!-- Pending Tasks -->
          <p class="text-h6" v-if="props.group?.pending_tasks?.length">Pending Tasks</p>
          <v-list v-if="props.group?.pending_tasks?.length">
            <v-list-item
              v-for="task in props.group?.pending_tasks"
              :key="task.id"
              :title="task.name"
            >
              <AddEditTask
                v-if="task.id == openTaskDialog.id"
                :task="task"
                @close="closeTaskDialog"
                :group_id="props.group.id"
                @success="handleCreateTask"
              />
              <TaskCard
                v-else
                :task="task"
                @click="openTaskDialog.id = task.id"
              />
            </v-list-item>
          </v-list>
          <AddEditTask
                v-if="openTaskDialog.show"
                @close="closeTaskDialog"
                :project_id="props.group.project_id"
                :group_id="props.group.id"
                @success="handleCreateTask"
              />
              <v-btn
                v-if="!openTaskDialog.show"
                variant="outlined"
                size="small"
                rounded
                @click="openTaskDialog.show = true"
                >Add a task</v-btn
              >

          <!-- WIP Tasks -->
          <p class="text-h6" v-if="props.group?.wip_tasks?.length">WIP Tasks</p>
          <v-list v-if="props.group?.wip_tasks?.length">
            <v-list-item
              v-for="task in props.group?.wip_tasks"
              :key="task.id"
              :title="task.name"
            >
              <TaskCard :task="task" />
            </v-list-item>
          </v-list>
          <!-- Completed Tasks -->
          <p class="text-h6" v-if="props.group?.completed_tasks?.length">Completed Tasks</p>
          <v-list v-if="props.group?.completed_tasks?.length">
            <v-list-item
              v-for="task in props.group?.completed_tasks"
              :key="task.id"
              :title="task.name"
            >
              <TaskCard :task="task" />
            </v-list-item>
          </v-list>
        </section>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="css" scoped></style>
