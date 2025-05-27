<script setup>
import { reactive } from "vue";
import { ref } from "vue";
import { requiredArrayRule } from "@/utils/formRules";
import request from "@/plugins/axios";
import { GET_MEMBERS_LIST, ADD_TEAM_MEMBER,REMOVE_TEAM_MEMBER } from "@/constants/apis";
import { useRoute } from "vue-router";
const route = useRoute();
const formRef = ref(null);
const teamMembersList = ref([]);
const props = defineProps({
  title: String,
  data: Object,
});

const form = reactive({
  teamMembers: [],
});
watch(
  () => props.data,
  () => {
    if (props.data) {
      form.teamMembers = props.data.team_members || [];
    }
  }
);
const tab = ref(null);

const emit = defineEmits(["close"]);
const close = () => {
  formRef.value.reset();
  emit("close");
};
const loadingTeamMembersList = ref(false);
const getTeamMembersList = async (search) => {
  if (search) {
    try {
      loadingTeamMembersList.value = true;
      const res = await request.get(GET_MEMBERS_LIST, { params: { search } });
      teamMembersList.value = res.data.detail;
    } catch (error) {
      console.log(error);
    } finally {
      loadingTeamMembersList.value = false;
    }
  }
};
const addTeamMember = async (member) => {
    try {
      const data = {
        project: route.params.project_id,
        employee: member.id,
      };
      const res = await request.post(ADD_TEAM_MEMBER, data);
      const {member_assigned_project_id} = res.data.detail;
      member = {...member,member_assigned_project_id};
    } catch (error) {
      console.log(error);
    }
};
const removeMember = async (member) => {
  try {
    const res = await request.patch(REMOVE_TEAM_MEMBER.replace(":member_assigned_project_id", member.member_assigned_project_id));
   form.teamMembers = form.teamMembers.filter((item) => item.id !== member.id);
  } catch (error) {
    console.log(error);
  }
};
const submit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    return;
  }
  try {
    const data = {
      ...props.data,
      group_name: form.name,
      description: form.description,
      project: route.params.project_id,
      team_members: form.teamMembers.map((item) => item.id),
    };
    const res = await request.post(CREATE_GROUP, data);
    emit("close");
    emit("success");
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <v-navigation-drawer location="right" temporary width="800">
    <v-card variant="flat">
      <v-card-title class="d-flex align-center justify-space-between gap-2">
        <div>
          <h4>{{ props.title }}</h4>
          <p class="text-subtitle-2 text-medium-emphasis">
            Search and add team members to your project
          </p>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        ></v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form ref="formRef">
          <label for="" class="text-subtitle-2 text-medium-emphasis"
            >Select Team Members</label
          >
          <v-autocomplete
            clear-on-select
            prepend-inner-icon="mdi-magnify"
            item-title="name"
            return-object
            multiple
            hide-selected
            @update:search="getTeamMembersList"
            @update:model-value="
              (value) => addTeamMember(value[value.length - 1])
            "
            :loading="loadingTeamMembersList"
            closable-chips
            chips
            hide-no-data
            :items="teamMembersList"
            autofocus
            v-model="form.teamMembers"
            variant="outlined"
            density="compact"
            rounded="lg"
            placeholder="Select Team Members"
            :rules="[requiredArrayRule]"
            @keypress.enter.prevent="submit"
            auto-select-first
          >
            <template v-slot:chip="{ props }"> </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.email">
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    {{ item.raw.name.charAt(0).toUpperCase() }}
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-form>
        <label for="" class="text-subtitle-2 text-medium-emphasis"
          >Team Members ({{ form.teamMembers?.length }})</label
        >
        <v-list>
          <v-list-item
            v-for="member in form.teamMembers"
            :key="member.id"
            :title="member.email"
            :subtitle="member.email"
            rounded="lg"
            border="thin solid"
            class="mb-2 pa-3"
          >
            <template v-slot:prepend>
              <v-avatar color="primary">
                {{ member.email.charAt(0).toUpperCase() }}
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-btn
                icon="mdi-close"
                variant="text"
                color="error"
                size="small"
                @click="
                  removeMember(member)
                "
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
      <!-- <v-card-actions v-if="form.teamMembers.length">
        <v-spacer />
        <v-btn
          color="primary"
          variant="outlined"
          class="rounded-lg"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          class="rounded-lg"
          @click="submit"
        >
          Add {{ form.teamMembers.length }} Members
        </v-btn>
      </v-card-actions> -->
    </v-card>
  </v-navigation-drawer>
</template>
