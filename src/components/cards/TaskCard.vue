<template>
  <v-card
    border="dashed"
    variant="outlined"
    class="rounded-lg d-flex flex-column gap-2"
  >
    <v-card-text>
      <div class="d-flex flex-column gap-4">
        <div class="d-flex align-center justify-space-between gap-2">
        <p class="text-h6">
          {{ task.task }}
        </p>
          <v-avatar color="blue" size="x-small" >
            {{ task.assignees?.email[0].toUpperCase() }}
          </v-avatar>
        </div>
      </div>
      <div class="d-flex align-center gap-2 mt-2">
        <v-chip
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
            class="border-dashed"
          >
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useDate } from 'vuetify'
const {task} = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const date = useDate(task.due_date);
</script>
