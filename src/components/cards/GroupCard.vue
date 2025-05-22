<script setup>
import { ref, reactive, computed } from "vue";
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
  showProgress: {
    type: Boolean,
    default: false,
  },
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
const progress = computed(() => {
  return (
    (props.group?.task_counts?.completed_tasks /
      props.group?.task_counts?.total_tasks) *
    100
  );
});
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between gap-2">
      <div class="text-h6">
        {{ props.group?.group_name }} <span class="bg-count rounded-xl px-2">{{props.group.pending_tasks?.length}}</span>
      </div>
    </div>

    <v-card v-bind="$attrs" class="rounded-lg mt-2">
      <v-card-title :title="props.group?.name">
        <div class="d-flex align-center gap-2 justify-space-between" v-if="props.showProgress">
          <v-progress-linear
            color="green"
            height="10"
            :model-value="progress"
            rounded
          ></v-progress-linear>
          <span class="text-subtitle-2"
            >{{ props.group?.task_counts?.completed_tasks }} /
            {{ props.group?.task_counts?.total_tasks }}</span
          >
        </div>
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="css" scoped></style>
