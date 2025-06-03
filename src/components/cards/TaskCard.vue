<script setup>
import { useDate } from "vuetify";
import { COMPLETED } from "@/constants/keys";
const { task, editable, group_id, project_id, taskIndex } = defineProps({
  task: {
    type: Object,
    required: true,
  },
  editable: {
    type: Boolean,
    required: false,
    default: false,
  },
  group_id: {
    type: String,
    required: true,
  },
  project_id: {
    type: String,
    required: true,
  },
  movable: {
    type: Boolean,
    required: false,
    default: false,
  },
  taskIndex: {
    type: Number,
    required: false,
    default: 1,
  },
});
const date = useDate(task.due_date);

const handleCreateTask = (updatedTask = {}) => {
  emit("success", updatedTask);
};

const emit = defineEmits(["success"]);

const addEditTaskDialog = reactive({
  id: null,
});
const openAddEditTaskDialog = () => (addEditTaskDialog.id = task.id);
const closeAddEditTaskDialog = () => (addEditTaskDialog.id = null);
</script>

<template>
  <AddEditTask
    v-if="addEditTaskDialog.id==task.id"
    :task="task"
    @close="closeAddEditTaskDialog"
    :group_id="group_id"
    :project_id="project_id"
    @success="handleCreateTask"
  />
  <v-card
    v-else
    :border="
      task.task_status === COMPLETED
        ? 'opacity-50 success md dashed'
        : 'thin dashed'
    "
    variant="outlined"
    class="rounded-lg d-flex flex-column gap-2 mb-2"
    :hover="editable"
    elevation="0"
  >
    <div class="d-flex">
      <div class="task-number  border-e-sm d-flex align-center justify-center">
        {{ taskIndex + 1 }}
      </div>

      <div
        class="pa-2 w-100"
       
      >
        <div class="d-flex flex-column gap-4"  @click="editable ? openAddEditTaskDialog() : null">
          <div class="d-flex align-center justify-space-between gap-2">
            <p class="text-subtitle-1 font-weight-medium">
              {{ task.task }}
            </p>
            <v-avatar color="blue" size="x-small" v-if="task?.assignees?.email">
              {{ task.assignees?.email[0].toUpperCase() }}
            </v-avatar>
          </div>
        </div>
        <div
          class="d-flex align-center flex-wrap gap-2 mt-2 w-full"
         
        >
          <v-chip
            v-if="task.due_date"
            border="thin dashed"
            :text="date.format(task.due_date, 'keyboardDate')"
            prepend-icon="mdi-calendar-blank-outline"
            label
            density="compact"
            variant="outlined"
            class="chip-text border-dashed text-medium-emphasis"
          >
          </v-chip>
          <v-chip
            v-if="task.duration"
            border="thin dashed"
            :text="task.duration"
            prepend-icon="mdi-clock-outline"
            label
            density="compact"
            variant="outlined"
            class="chip-text border-dashed text-medium-emphasis"
          >
          </v-chip>
          <div class="d-flex align-center gap-2" v-if="task.task_priority">
            <label for="priority" class="text-label"> Priority: </label>
            <v-chip
              :text="task.task_priority?.text"
              prepend-icon="mdi-alert-outline"
              label
              density="compact"
              :color="task.task_priority?.color"
              variant="flat"
              class="border-dashed text-white"
            >
            </v-chip>
          </div>
          <div class="d-flex align-center gap-2" v-if="task.project">
            <label for="priority" class="text-caption"> Project: </label>
            <v-chip
              :text="task.project?.project_name"
              label
              density="compact"
              color="primary"
              variant="flat"
              class="chip-text text-medium-emphasis"
            >
            </v-chip>
          </div>
          <div class="d-flex align-center gap-2" v-if="task.project_group">
            <label for="priority" class="text-caption"> Group: </label>
            <v-chip
              :text="task.project_group?.project_group_name"
              label
              density="compact"
              color="secondary"
              variant="flat"
              class="chip-text text-medium-emphasis"
            >
            </v-chip>
          </div>
          <div class="d-flex align-center gap-2 ml-auto" v-if="movable">
            <slot name="actions" :task="task"></slot>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>
<style scoped>
.chip-text {
  font-family: Inter;
  font-weight: 600;
  font-size: 0.6875rem;
  line-height: 13px;
  letter-spacing: 0%;
}
.task-number {
  min-width: 40px;
  max-width: 40px;
  background: #4764fc14;
}
</style>
