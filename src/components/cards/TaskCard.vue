<script setup>
import { useDate } from "vuetify";
const { task, editable, group_id, project_id } = defineProps({
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
});
const date = useDate(task.due_date);

const handleCreateTask = (createdTask = {}) => {
  emit("success", createdTask);
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
    v-if="addEditTaskDialog.id"
    :task="task"
    @close="closeAddEditTaskDialog"
    :group_id="group_id"
    :project_id="project_id"
    @success="handleCreateTask"
  />
  <v-card
    v-else
    border="thin dashed"
    variant="outlined"
    class="rounded-lg d-flex flex-column gap-2"
    :hover="editable"
  >
    <v-card-text @click="editable ? openAddEditTaskDialog() : null">
      <div class="d-flex flex-column gap-4">
        <div class="d-flex align-center justify-space-between gap-2">
          <p class="text-h6">
            {{ task.task }}
          </p>
          <v-avatar color="blue" size="x-small">
            {{ task.assignees?.email[0].toUpperCase() }}
          </v-avatar>
        </div>
      </div>
      <div class="d-flex align-center gap-2 mt-2">
        <v-chip
          border="thin dashed"
          :text="date.format(task.due_date, 'fullDateWithWeekday')"
          prepend-icon="mdi-calendar-blank-outline"
          label
          density="compact"
          color="secondary"
          variant="outlined"
          class="border-dashed"
        >
        </v-chip>
        <v-chip
          border="thin dashed"
          :text="task.duration"
          prepend-icon="mdi-clock-outline"
          label
          density="compact"
          color="secondary"
          variant="outlined"
          class="border-dashed"
        >
        </v-chip>
        <div class="d-flex align-center gap-2">
          <label for="priority" class="text-label"> Priority: </label>
          <v-chip
            :text="task.task_priority.text"
            prepend-icon="mdi-alert-outline"
            label
            density="compact"
            :color="task.task_priority.color"
            variant="flat"
            class="border-dashed text-white"
          >
          </v-chip>
        </div>
      </div>
    </v-card-text>
    <v-card-actions v-if="movable">
      <slot name="actions" :task="task"></slot>
    </v-card-actions>
  </v-card>
</template>
