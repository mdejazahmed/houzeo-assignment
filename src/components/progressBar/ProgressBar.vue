
<script setup>
import { computed } from "vue";

const props = defineProps({
  totalTask: {
    type: Number,
    default: 0,
  },
  completedTask: {
    type: Number,
    default: 0,
  },
});
const progress = computed(() => {
  return (props.completedTask / props.totalTask) * 100;
});
</script>
<template>
  <div class="d-flex align-center gap-2 justify-space-between">
    <v-progress-linear
      height="10"
      :model-value="progress"
      rounded
    ></v-progress-linear>
    <span class="text-subtitle-2"
      >{{ props.completedTask }} / {{ props.totalTask }}</span
    >
  </div>
</template>

<style scoped>
.v-progress-linear:deep(.v-progress-linear__determinate) {
  background: linear-gradient(90deg, #35d0af 0%, #6efeb3 100%);
}
</style>
