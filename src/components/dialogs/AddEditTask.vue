<script setup>
import { ref, reactive } from "vue";
import { requiredRule } from "@/utils/formRules";
import { CREATE_TASK, GET_PROJECT_TEAM_LIST } from "@/constants/apis";
import request from "@/plugins/axios";
import { useRoute } from "vue-router";

const route = useRoute();
const { group_id, task,project_id } = defineProps({
  group_id: {
    type: String,
    required: true,
  },
  task: {
    type: Object,
    required: false,
  },
  project_id: {
    type: String,
    required: true,
  },
});
const formRef = ref(null);
const loading = ref(false);
const emit = defineEmits(["success", "close"]);

const taskForm = reactive({
  task: task?.task || "",
  task_priority: task?.task_priority.text || "",
  assignee: task?.assignees || null,
  due_date: task?.due_date || "",
  duration: task?.duration || "",
});
const priorities = ref([
  {
    value: "Low",
    text: "Low",
    icon: "mdi-alert-outline",
    color: "lowPriority",
  },
  {
    value: "Medium",
    text: "Medium",
    icon: "mdi-alert-outline",
    color: "mediumPriority",
  },
  {
    value: "High",
    text: "High",
    icon: "mdi-alert-outline",
    color: "highPriority",
  },
]);
const assigneesList = ref([]);
const durations = ref([
  {
    value: "1 Hour",
    text: "1 Hr",
  },
  {
    value: "2 Hours",
    text: "2 Hr",
  },
  {
    value: "4 Hours",
    text: "4 Hr",
  },
  {
    value: "8 Hours",
    text: "8 Hr",
  },
]);
const getAssigneesList = async () => {
  try {
    const res = await request.get(
      GET_PROJECT_TEAM_LIST.replace(":project_id", project_id)
    );
    assigneesList.value = res.data?.detail;
  } catch (error) {
    console.log(error);
  }
};

const addEditTask = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  loading.value = true;
  const data = {
    assignees: taskForm.assignee?.id,
    project_group: group_id,
    due_date: taskForm.due_date,
    task: taskForm.task,
    task_priority: taskForm.task_priority,
    duration: taskForm.duration,
  };
  if(task?.id){
    data.id = task?.id;
  }
  try {
    const res = await request.post(CREATE_TASK, data);
    handleClose();
    emit("success");
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
const handleClose = () => {
  formRef.value.reset();
  emit("close");
};
</script>

<template>
  <v-card class="rounded-lg" variant="outlined" border="dashed" >
    <v-card-title
      class="d-flex align-center justify-space-between gap-2 bg-background"
    >
      <h5>{{ task?.id ? 'Edit Task' : 'Add a task' }}</h5>
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="handleClose"
      ></v-btn>
    </v-card-title>
    <v-divider class="border-dashed"></v-divider>
    <v-card-text>
      <v-form
        ref="formRef"
        @submit.prevent="addEditTask"
        class="d-flex flex-column gap-4"
      >
        <v-text-field
          v-model="taskForm.task"
          variant="underlined"
          placeholder="Enter Task Name"
          @keypress.enter.prevent="addEditTask"
          :rules="[requiredRule]"
        ></v-text-field>
        <div class="d-flex gap-4">
          <label for="priority" class="text-subtitle-2 w-10">
            Select priority
          </label>
          <v-radio-group
            v-model="taskForm.task_priority"
            :rules="[requiredRule]"
          >
            <v-chip-group v-model="taskForm.task_priority" mandatory>
              <v-chip
                v-for="priority in priorities"
                :key="priority.value"
                :text="priority.text"
                :value="priority.value"
                label
                :variant="
                  taskForm.task_priority == priority.value ? 'flat' : 'outlined'
                "
                :color="priority.color"
                :prepend-icon="priority.icon"
                density="compact"
              ></v-chip>
            </v-chip-group>
          </v-radio-group>
        </div>
        <div class="d-flex gap-4">
          <label for="assignee" class="text-subtitle-2 w-10"> Assignee </label>
          <v-autocomplete
            v-model="taskForm.assignee"
            :items="assigneesList"
            variant="underlined"
            density="compact"
            placeholder="Enter Name"
            rounded
            item-title="email"
            return-object
            hide-selected
            @update:search="getAssigneesList"
            closable-chips
            chips
            :rules="[requiredRule]"
          >
            <template v-slot:chip="{ props, item }">
              <UserChip :user="item.raw" v-bind="props" />
            </template>
          </v-autocomplete>
        </div>
        <div class="d-flex gap-4">
          <label for="priority" class="text-subtitle-2 w-10"> Due Date </label>
          <input type="date" v-model="taskForm.due_date" />
        </div>
        <div class="d-flex gap-4">
          <label for="priority" class="text-subtitle-2 w-10"> Duration </label>
          <v-radio-group v-model="taskForm.duration" :rules="[requiredRule]">
            <v-chip-group
              v-model="taskForm.duration"
              mandatory
              :rules="[requiredRule]"
            >
              <v-chip
                v-for="duration in durations"
                :key="duration.value"
                :text="duration.text"
                :value="duration.value"
                :variant="
                  duration.value == taskForm.duration ? 'flat' : 'outlined'
                "
                color="primary"
                density="compact"
              ></v-chip>
            </v-chip-group>
          </v-radio-group>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        variant="flat"
        color="primary"
        class="rounded-lg"
        type="submit"
        @click="addEditTask"
        :loading="loading"
        >{{ task?.id ? 'Save' : 'Add Task' }}</v-btn
      >
      <v-btn
        variant="outlined"
        color="secondary"
        class="rounded-lg"
        @click="handleClose"
        >Cancel</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<style scoped>
.w-10 {
  width: 10%;
}
</style>
