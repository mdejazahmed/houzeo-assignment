<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { requiredRule, emailRule, requiredArrayRule } from "@/utils/formRules";
import { useDate } from "vuetify";
const emit = defineEmits(["close", "addUser"]);
const form = ref(null);
const loading = ref(false);
const date = useDate();

const forms = reactive([
  {
    name: "",
    email: "",
    mobile: "",
    birthDate: "",
    gender: "",
    selectedLanguages: [],
    city: [],
    file: [],
  },
]);

const languages = [
  { text: "Vue.js", value: "vue", icon: "mdi-vuejs", color: "green" },
  { text: "React.js", value: "react", icon: "mdi-react", color: "blue" },
  { text: "Angular", value: "angular", icon: "mdi-angular", color: "red" },
];

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

const genderOptions = [
  { text: "Male", value: "male" },
  { text: "Female", value: "female" },
];
const resetForm = () => {
  form.value.reset();
};

const handleSubmit = async () => {
  const { valid } = await form.value.validate();

  if (!valid) {
    return;
  }

  loading.value = true;

  try {
    emit("addUser", forms);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
function formatPhoneNumber(phone) {
  if (!phone) return "";
  // Remove all non-digit characters
  const digits = phone?.replace(/\D/g, "") || "";

  if (digits.length >= 10) {
    return `(${digits?.slice(0, 3)}) ${digits?.slice(3, 6)}-${digits?.slice(
      6
    )}`;
  }

  return digits;
}
const addMoreUser = () => {
  forms.push({
    name: "",
    email: "",
    mobile: "",
    birthDate: "",
    gender: "",
    selectedLanguages: [],
    city: [],
    file: [],
  });
  nextTick(() => {
    if (document.getElementById(`userForm${forms.length - 1}`)) {
      const newAddedCard = document.getElementById(
        `userForm${forms.length - 1}`
      );
      if (newAddedCard) {
        newAddedCard.scrollIntoView({
          behavior: "smooth",
          block: "center", // This will center the dialog vertically
        });
      }
    }
  });
};
const removeUser = (index) => {
  forms.splice(index, 1);
};
const handleClose = () => {
  emit("close");
  resetForm();
};
</script>
<template>
  <v-dialog width="50%" persistent scrollable>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between">
        Add User
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="handleClose"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form" class="d-flex flex-column gap-4">
          <v-card
            v-for="(user, formIndex) of forms"
            :key="formIndex"
            :id="`userForm${formIndex}`"
          >
            <v-card-title class="d-flex justify-space-between">
              Form no. {{ formIndex + 1 }}
              <v-btn
                v-if="forms.length > 1"
                icon="mdi-delete"
                variant="text"
                size="small"
                color="error"
                @click="removeUser(formIndex)"
              ></v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    type="text"
                    variant="outlined"
                    density="compact"
                    :rules="[requiredRule]"
                    hide-details="auto"
                    v-model="user.name"
                    label="Name"
                    placeholder="eg: John Doe"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :rules="[requiredRule, emailRule]"
                    hide-details="auto"
                    v-model="user.email"
                    type="email"
                    label="Email"
                    placeholder="eg: example@gmail.com"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :rules="[requiredRule]"
                    hide-details="auto"
                    v-model.trim="user.mobile"
                    @update:modelValue="
                      (val) => {
                        user.mobile = formatPhoneNumber(val);
                      }
                    "
                    label="Mobile"
                    placeholder="eg: (123) 456-7890"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    density="compact"
                    :rules="[requiredRule]"
                    hide-details="auto"
                    v-model="user.birthDate"
                    type="date"
                    label="Birth Date"
                    placeholder="Select Birth Date"
                  />
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    variant="outlined"
                    density="compact"
                    :rules="[requiredArrayRule]"
                    hide-details="auto"
                    v-model="user.city"
                    :items="cities"
                    label="City"
                    placeholder="Select City"
                    multiple
                  />
                </v-col>
                <v-col cols="12">
                  <v-label>Gender</v-label>
                  <v-radio-group
                    v-model="user.gender"
                    :rules="[requiredRule]"
                    hide-details="auto"
                    inline
                    density="compact"
                    color="primary"
                  >
                    <v-radio
                      v-for="gender in genderOptions"
                      :key="gender.value"
                      :label="gender.text"
                      :value="gender"
                    />
                  </v-radio-group>
                </v-col>

                <v-col cols="12">
                  <v-label>Select Languages</v-label>
                  <div class="d-flex align-center gap-2">
                    <v-checkbox
                      v-for="language in languages"
                      :key="language.value"
                      :label="language.text"
                      :value="language"
                      v-model="user.selectedLanguages"
                      hide-details
                      color="primary"
                      density="compact"
                      :rules="[requiredArrayRule]"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-label>File</v-label>
                  <v-file-input
                    variant="outlined"
                    density="compact"
                    :rules="[requiredRule]"
                    hide-details="auto"
                    v-model="user.file"
                    label="file"
                    accept="image/jpeg,application/pdf"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-btn variant="text" color="primary" @click="addMoreUser"
            >+ Add More</v-btn
          >
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          variant="outlined"
          color="primary"
          rounded="lg"
          @click="handleSubmit"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
