<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <div>
        <h5 class="text-h5 font-weight-bold">{{ project.project_name }} 🚀</h5>
        <p class="text-subtitle-2 text-medium-emphasis">
          {{ project.description }}
        </p>
      </div>
      <div class="d-flex align-center gap-2">
        <v-btn
          icon="mdi-magnify"
          variant="outlined"
          color="primary"
          size="small"
        ></v-btn>
        <v-btn variant="outlined" color="primary" rounded
          >Add Team Members</v-btn
        >
        <v-btn
          variant="flat"
          color="primary"
          rounded
          @click="addGroupDialog.show = true"
          >Add Group</v-btn
        >
      </div>
    </div>
    <v-row>
      <v-col
        v-for="group in project.project_groups"
        :key="group.id"
        cols="12"
        
      >
        <GroupCard :group="group" @success="getProjectDetail"/>
      </v-col>
    </v-row>
    <AddEditGroupModal
      v-model="addGroupDialog.show"
      @close="addGroupDialog.show = false"
      :title="addGroupDialog.title"
      :data="addGroupDialog.data"
      @success="getProjectDetail"
    />
  </v-container>
</template>

<script setup>
import { reactive } from "vue";
import { ref } from "vue";
import request from "@/plugins/axios";
import { GET_PROJECT } from "@/constants/apis";
import { useRoute } from "vue-router";
import AddEditGroupModal from "@/components/dialogs/AddEditGroupModal.vue";
import GroupCard from "@/components/cards/GroupCard.vue";
const route = useRoute();
const addGroupDialog = reactive({
  show: false,
  title: "Add Group",
  data: null,
});
const project = ref({});
const getProjectDetail = async () => {
  try {
    const res = await request.get(
      GET_PROJECT.replace(":project_id", route.params.project_id)
    );
    project.value = res.data?.detail;
  } catch (error) {
    console.log(error);
  }
};
getProjectDetail();
</script>
