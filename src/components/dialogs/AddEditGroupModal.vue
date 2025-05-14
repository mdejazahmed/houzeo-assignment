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
                variant="underlined"
                placeholder="Enter Group Name"
                :rules="[requiredRule]"
              ></v-text-field>
              <v-tabs v-model="tab">
                <v-tab value="description">Description</v-tab>
              </v-tabs>
              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="description">
                  <v-textarea
                    v-model="form.description"
                    variant="outlined"
                    rounded
                    placeholder="Enter Description"
                  ></v-textarea>
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
  import request from "@/plugins/axios";
  import { ref } from "vue";
  import { useUserStore } from "@/stores/user";
  import { requiredRule, requiredArrayRule } from "@/utils/formRules";
import { CREATE_GROUP } from "@/constants/apis";
import { useRoute } from "vue-router";
const route = useRoute();
  const formRef = ref(null);
  
  const { user } = useUserStore();
  const props = defineProps({
    title: String,
    data: Object,
  });
  
  const form = reactive({
    name: "",
    description:  "",
  });
  watch(() => props.data, () => {
    if(props.data){
      form.name = props.data.project_name || "";
      form.description = props.data.description || "";
    }
  });
  const tab = ref(null);
  
  const emit = defineEmits(["close"]);
  const close = () => {
    
    emit("close");
  };
  const submit = async () => {
    if (!formRef.value.validate()) {
      return;
    }
    try {
      const data = {
        ...props.data,
        group_name: form.name,
        description: form.description,
       project: route.params.project_id,
      };
      const res = await request.post(CREATE_GROUP, data);
      emit("close");
      emit("success");
    } catch (error) {
      console.log(error);
    }
  };
  
  </script>
  