<template>
  <v-navigation-drawer location="right" temporary width="800">
    <v-card variant="flat">
      <v-card-title class="d-flex align-center gap-2">
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        ></v-btn>
        <h4>{{ props.title }}</h4>
      </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <div class="d-flex flex-column gap-4">
            <v-text-field
              v-model="form.name"
              @keypress.enter.prevent="submit"
              label="Project Name"
              variant="underlined"
              placeholder="Enter Project Name"
              :rules="[requiredRule]"
            ></v-text-field>
            <div class="d-flex align-center gap-4">
              <label for="addTeam" class="text-subtitle-2">Add Team</label>
              <v-autocomplete
                v-model="form.teamMembers"
                :items="teamMembersList"
                variant="underlined"
                density="compact"
                placeholder="Enter Name"
                rounded
                item-title="email"
                return-object
                multiple
                hide-selected
                @update:search="getTeamMembersList"
                closable-chips
                chips
                :rules="[requiredRule]"
                hide-no-data
              >
                <!-- <template v-slot:chip="{ props, item }">
                  <v-chip  v-bind="props" />
                </template> -->
              </v-autocomplete>
            </div>
            <div class="d-flex align-center gap-4">
              <label for="deadline" class="text-subtitle-2">Created by</label>
              <UserChip :user="user" />
            </div>
            <v-tabs v-model="tab">
              <v-tab value="description">Description</v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="description">
                <v-textarea
                  v-model="form.description"
                  @keypress.enter.prevent="submit"
                  variant="outlined"
                  rounded
                  placeholder="Enter Description"
                  no-resize
                  :rules="[maxLengthRule(form.description,255)]"
                >
                <template v-slot:counter>
                 {{form.description?.length||0}}/255
                </template>
              </v-textarea>
              </v-tabs-window-item>
            </v-tabs-window>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          variant="flat"
          class="rounded-lg"
          type="submit"
          @click="submit"
        >
          {{ props.title }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script setup>
import { reactive } from "vue";
import { GET_MEMBERS_LIST, CREATE_PROJECT,DELETE_PROJECT } from "@/constants/apis";
import request from "@/plugins/axios";
import UserChip from "@/components/chips/UserChip.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { requiredRule, requiredArrayRule,maxLengthRule } from "@/utils/formRules";

const formRef = ref(null);

const { user } = useUserStore();
const props = defineProps({
  title: String,
  data: Object,
});

const form = reactive({
  name: null,
  teamMembers:  [],
  description:  "",
});
watch(() => props.data, () => {
  if(props.data){
    form.name = props.data.project_name || null;
    form.teamMembers = props.data.team_members || [];
    form.description = props.data.description || "";
  }
});
const tab = ref(null);
const teamMembersList = ref([]);
const getTeamMembersList = async (search) => {
  try {
    const res = await request.get(GET_MEMBERS_LIST,{params:{search}});
    teamMembersList.value = res.data.detail;
  } catch (error) {
    console.log(error);
  }
};

const emit = defineEmits(["close"]);
const close = () => {
  formRef.value.reset();
  emit("close");
};
const submit = async (e) => {

 const {valid} = await formRef.value.validate();
  if (!valid) {
    return;
  }
  try {
    const data = {
      ...props.data,
      project_name: form.name,
      team_members: form.teamMembers.map((item) => item.id),
      created_by: user.id,
      description: form.description,
    };
    const res = await request.post(CREATE_PROJECT, data);
    emit("close");
    emit("success");
  } catch (error) {
    console.log(error);
  }
};

</script>
