<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import TaskCard from "@/components/cards/TaskCard.vue";
import request from "@/plugins/axios";
import { GET_WEEKLY_PLAN_HISTORY_OF_PROJECT } from "@/constants/apis";
const route = useRoute();
const router = useRouter();
const project = ref({});
const historyList = ref([]);
const getProjectDetail = async () => {
  try {
    const res = await request.get(
      GET_WEEKLY_PLAN_HISTORY_OF_PROJECT.replace(
        ":project_id",
        route.params.project_id
      )
    );
    const {data,...rest}= res.data?.detail;
    
    project.value = rest;
    historyList.value = data;
    
  } catch (error) {
    console.log(error);
  }
};
getProjectDetail();
</script>
<template>
  <v-container>
  <v-row
    class="d-flex justify-space-between bg-background"
    style="position: sticky; top: 0; z-index: 999"
  >
    <v-col cols="12" sm="6" md="4" lg="6" class="d-flex gap-2">
      <v-icon
        size="30"
        icon="mdi-arrow-left-circle-outline"
        @click="router.back()"
      ></v-icon>
      <div>
        <h5 class="text-h5 font-weight-bold">{{project.project_name}} 🚀</h5>
        <p class="text-subtitle-2 text-medium-emphasis">
        {{project.project_description}}
        </p>
      </div>
    </v-col>
    <v-col
      cols="12"
      sm="6"
      md="4"
      lg="6"
      class="d-flex align-center justify-end gap-2"
    >
      <v-btn
        icon="mdi-magnify"
        variant="outlined"
        color="primary"
        size="small"
      ></v-btn>
    </v-col>
  </v-row>
  <v-row> 
    <v-col cols="12" class="d-flex align-center justify-space-between gap-2">
      <h5 class="text-h5 font-weight-bold">Tasks History</h5>
      <div style="width: 200px;">
      <v-autocomplete
        label="Search"
        variant="outlined"
        density="compact"
        class="mt-2"
        hide-details
      ></v-autocomplete>
      </div>
    </v-col>
    <v-col cols="12" v-for="weeklyPlan,i in historyList" :key="i">
      <div>
        <p class="text-subtitle-1 text-medium-emphasis pa-2 bg-background" style="position: sticky; top: 64px; z-index: 99">Weekly Plan (31st Mar - 5th Apr)</p>
      <v-card-text class="bg-surface rounded-lg">
        <TaskCard v-for="task,i in weeklyPlan.tasks" :key="i" :task="task" :taskIndex="i"/>
      </v-card-text>
      </div>
    </v-col>
  </v-row>
</v-container>
</template>


