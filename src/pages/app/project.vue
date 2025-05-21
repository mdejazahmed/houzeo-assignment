
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
  getProjectDetail();
};
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

<template>
  <v-container>
    <v-row class="d-flex justify-space-between">
      <v-col cols="12" sm="6" md="4" lg="6">
        <h5 class="text-h5 font-weight-bold">{{ project.project_name }} 🚀</h5>
        <p class="text-subtitle-2 text-medium-emphasis">
          {{ project.description }}
        </p>
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
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="group in project.project_groups" :key="group.id" cols="12">
        <GroupCard :group="group">
          <section>
            <p class="text-h6" >
              Pending Tasks
            </p>
            <v-list >
              <v-list-item v-for="task in group?.pending_tasks" :key="task.id">
                <TaskCard
                  :editable="true"
                  :task="task"
                  :group_id="group.id"
                  :project_id="project.id"
                  @success="handleCreateTask"
                />
              </v-list-item>
              <v-list-item>
                <AddEditTask
              v-if="openTaskDialog.show"
              @close="closeTaskDialog"
              :project_id="project.id"
              :group_id="group.id"
              @success="handleCreateTask"
            />
            <v-btn
              v-if="!openTaskDialog.show"
              variant="outlined"
              size="small"
              rounded
              @click="openTaskDialog.show = true"
              >Add a task</v-btn
            >
              </v-list-item>
            </v-list>
            
           
          </section>
          <section>
            <p class="text-h6" v-if="group?.wip_tasks?.length">WIP Tasks</p>
            <v-list v-if="group?.wip_tasks?.length">
              <v-list-item v-for="task in group?.wip_tasks" :key="task.id">
                <TaskCard :task="task" 
                :group_id="group.id"
                  :project_id="project.id"
                />
              </v-list-item>
            </v-list>
          </section>
          <section>
            <p class="text-h6" v-if="group?.completed_tasks?.length">
              Completed Tasks
            </p>
            <v-list v-if="group?.completed_tasks?.length">
              <v-list-item
                v-for="task in group?.completed_tasks"
                :key="task.id"
              >
                <TaskCard :task="task"
                :group_id="group.id"
                  :project_id="project.id"
                />
              </v-list-item>
            </v-list>
          </section>
        </GroupCard>
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

