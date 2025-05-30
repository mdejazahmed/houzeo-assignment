<script setup>
import { useDate } from "vuetify";
import { COMPLETED } from "@/constants/keys";
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
    v-if="addEditTaskDialog.id"
    :task="task"
    @close="closeAddEditTaskDialog"
    :group_id="group_id"
    :project_id="project_id"
    @success="handleCreateTask"
  />
  <v-card
    v-else
    :border="task.task_status === COMPLETED ? 'opacity-50 success md dashed' : 'thin dashed'"
    variant="outlined"
    class="rounded-lg d-flex flex-column gap-2"
    :hover="editable"
  >
    <v-card-text @click="editable ? openAddEditTaskDialog() : null" >
      <div class="d-flex flex-column gap-4">
        <div class="d-flex align-center justify-space-between gap-2">
          <p class="text-subtitle-1 font-weight-medium">
            {{ task.task }}
          </p>
          <v-avatar color="blue" size="x-small" v-if="task?.assignees?.email">
            {{ task.assignees?.email[0].toUpperCase() }}
          </v-avatar>
        </div>
      </div>
      <div class="d-flex align-center flex-wrap gap-2 mt-2" v-if="task?.due_date || task?.duration || task?.task_priority">
        <v-chip
        v-if="task.due_date"
          border="thin dashed"
          :text="date.format(task.due_date, 'fullDateWithWeekday')"
          prepend-icon="mdi-calendar-blank-outline"
          label
          density="compact"
         
          variant="outlined"
          class="border-dashed"
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
          class="border-dashed"
        >
        </v-chip>
        <!-- <div class="d-flex align-center gap-2" v-if="task.task_priority">
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
        </div> -->
        <div class="d-flex align-center gap-2" v-if="task.project">
          <label for="priority" class="text-label"> Project: </label>
          <v-chip
            :text="task.project?.project_name"
            label
            density="compact"
            color="primary"
            variant="flat"
          >
          </v-chip>
        </div>
        <div class="d-flex align-center gap-2" v-if="task.project_group">
          <label for="priority" class="text-label"> Group: </label>
          <v-chip
            :text="task.project_group?.project_group_name"
           
            label
            density="compact"
            color="secondary"
            variant="flat"
          >
          </v-chip>
        </div>
        
      </div>
    </v-card-text>
    <v-card-actions v-if="movable">
     <v-spacer></v-spacer>
      <slot name="actions" :task="task"></slot>
    </v-card-actions>
  </v-card>
</template>
