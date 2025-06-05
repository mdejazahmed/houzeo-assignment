<script setup>
import CustomTable from "@/components/customTable/CustomeTable.vue";
import UserForm from "@/components/UserForm.vue";
import { useDate } from "vuetify";
const date = useDate();
const headers = [
  { title: "Name", key: "name", align: "center" },
  { title: "Email", key: "email", align: "center" },
  { title: "Mobile", key: "mobile", align: "center" },
  { title: "Birth Date", key: "birthDate", align: "center" },
  { title: "Gender", key: "gender", align: "center" },
  { title: "Languages", key: "selectedLanguages", align: "center" },
  { title: "City", key: "city", align: "center" },
  { title: "File", key: "file", align: "center" },
];
const submittedData = ref([
  {
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "(123) 456-7890",
    birthDate: "2022-01-01",
    gender: { text: "Male", value: "male" },
    selectedLanguages: [
      { text: "Vue.js", value: "vue", icon: "mdi-vuejs", color: "green" },
      { text: "React.js", value: "react", icon: "mdi-react", color: "blue" },
      { text: "Angular", value: "angular", icon: "mdi-angular", color: "red" },
    ],
    city: ["New York", "Los Angeles"],
    file: [],
  },
]);
const addUser = (users) => {
  console.log(users);
  submittedData.value.push(...users);

  userForm.value = false;
};
const userForm = ref(false);
</script>
<template>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="6">
      <h5 class="text-h5">Hello, Masnsi 👋</h5>
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
    <template #gender="{ item }">
      {{ item.gender.text }}
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
     {{item.file.name}}
    </template>
  </CustomTable>
</template>

<style scoped></style>
