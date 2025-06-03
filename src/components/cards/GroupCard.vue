<script setup>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";
import ProgressBar from "@/components/progressBar/ProgressBar.vue";
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
    <v-card class="group-header bg-background d-flex align-center justify-space-between gap-2" variant="flat" >
      <v-card-title>
        {{ props.group?.group_name }}
        <span class="bg-count rounded-xl px-2">{{
          props.group.pending_tasks?.length
        }}</span>
      </v-card-title>
    </v-card>

    <v-card v-bind="$attrs" class="rounded-lg">
      <v-card-title :title="props.group?.name">
        <ProgressBar :total-task="props.group?.task_counts?.total_tasks" :completed-task="props.group?.task_counts?.completed_tasks"/>
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="css" scoped>
.group-header{
  position: sticky;
  top: 112px;
  z-index: 99;
  padding: 8px;
}
</style>
