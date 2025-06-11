<script setup>
import CustomTable from "@/components/customTable/CustomeTable.vue";
import UserForm from "@/components/UserForm.vue";
import { useDate } from "vuetify";
import { onMounted } from "vue";
import  axiosInstance  from "@/plugins/axios";
import { GET_USERS } from "@/constants/apis";
const date = useDate();
const headers = [
  { title: "Group", key: "groupFields", align: "center" },
  { title: "Birth Date", key: "birthDate", align: "center" },
  { title: "Gender", key: "gender", align: "center" },
  { title: "Languages", key: "selectedLanguages", align: "center" },
  { title: "City", key: "city", align: "center" },
  { title: "File", key: "file", align: "center" },
];
const submittedData = ref([
]);
const addUser = (data) => {
  console.log(data);
  submittedData.value.push(data);

  userForm.value = false;
};
const userForm = ref(false);

const fetchUsers = async () => {
  try {
    const res = await axiosInstance.get(GET_USERS);
    console.log(res);
    submittedData.value = res.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Fetch users on component mount
onMounted(() => {
  fetchUsers();
});
</script>
<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="6">
      <h5 class="text-h5">Hello, Mansi 👋</h5>
      <p class="text-subtitle-2 text-medium-emphasis">Welcome to Houzeo.</p>
    </v-col>
    <v-col
      cols="12"
      sm="6"
      md="4"
      lg="6"
      class="d-flex align-center justify-end gap-2"
    >
      <v-btn
        variant="flat"
        color="primary"
        rounded="lg"
        @click="userForm = true"
        >Add User</v-btn
      >
    </v-col>
  </v-row>
  <UserForm v-model="userForm" @close="userForm = false" @addUser="addUser" />
  <CustomTable :headers="headers" :items="submittedData">
  <template #groupFields="{ item }">
   <ul>
    <li v-for="group in item.groupFields" :key="group.name">
     {{group.name}}
     {{group.email}}
     {{group.mobile}}
    </li>
   </ul>
  </template>
    <template #gender="{ item }">
      {{ item.gender?.text }}
    </template>
    <template #birthDate="{ item }">
      {{ date.format(item.birthDate, "fullDate") }}
    </template>
    <template #selectedLanguages="{ item }">
      <v-chip
        v-for="lang in item.selectedLanguages"
        :key="lang.value"
        class="ma-1"
        :color="lang.color"
        density="compact"
        size="small"
      >
        <v-icon :icon="lang.icon"></v-icon>
        {{ lang.text }}
      </v-chip>
    </template>
    <template #city="{ item }">
      {{ item.city.join(", ") }}
    </template>
    <template #file="{ item }">
     {{item.file?.name}}
    </template>
  </CustomTable>
</template>

<style scoped></style>
