<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { requiredRule, emailRule, requiredArrayRule } from "@/utils/formRules";
import { useDate } from "vuetify";
import axiosInstance from "@/plugins/axios";
const emit = defineEmits(["close", "addUser"]);
const formRef = ref(null);
const loading = ref(false);
const date = useDate();

const form = reactive({
  groupFields: [
    {
      name: "",
      email: "",
      mobile: "",
    },
    {
      name: "",
      email: "",
      mobile: "",
    },
  ],
  birthDate: "",
  gender: "",
  selectedLanguages: [],
  city: [],
  file: null,
});

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
  formRef.value.reset();
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  loading.value = true;

  try {
    const formData = {...form,file:{name:form.file?.name,
        size: form.file?.size,
        }};
    const res = await axiosInstance.post("/users", formData);
    emit("addUser", res.data);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
function formatPhoneNumberAndSetCursor(event) {
  const phone = event.target.value;
  const cleaned = phone.replace(/\D/g, "");
  let formatted = "";

  if (cleaned.length <= 3) {
    formatted = cleaned;
  } else if (cleaned.length <= 6) {
    formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
      3,
      6
    )}-${cleaned.slice(6, 10)}`;
  }
  nextTick(() => {
    const cursorPosition = formatted.length;
    event.target.setSelectionRange(cursorPosition, cursorPosition);
  });

  return formatted;
}

const addMoreGroup = () => {
  form.groupFields.push({
    name: "",
    email: "",
    mobile: "",
  });
  nextTick(() => {
    if (document.getElementById(`userForm${form.groupFields.length - 1}`)) {
      const newAddedCard = document.getElementById(
        `userForm${form.groupFields.length - 1}`
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
  form.splice(index, 1);
};
const handleClose = () => {
  emit("close");
  resetForm();
};
</script>
<template>
  <v-dialog width="60%" persistent scrollable>
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
        <v-form ref="formRef" class="d-flex flex-column gap-4">
          <v-card
            v-for="(user, index) of form.groupFields"
            :key="index"
            color="#fafafa"
          >
            <v-card-title class="d-flex justify-space-between">
              Group {{ index + 1 }}
              <v-btn
                v-if="form.groupFields.length > 2"
                icon="mdi-close"
                variant="text"
                size="small"
                color="error"
                @click="form.groupFields.splice(index, 1)"
              ></v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="4">
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
                <v-col cols="4">
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
                <v-col cols="4">
                  <v-text-field
                    :id="`mobileInput${index}`"
                    variant="outlined"
                    density="compact"
                    :rules="[requiredRule]"
                    hide-details="auto"
                    v-model.trim="user.mobile"
                    @input="
                      (e) => {
                        user.mobile = formatPhoneNumberAndSetCursor(e);
                      }
                    "
                    label="Mobile"
                    placeholder="eg: (123) 456-7890"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="addMoreGroup"
              >+ Add More</v-btn
            ></v-card-actions
          >
          <v-row>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                density="compact"
                :rules="[requiredRule]"
                hide-details="auto"
                v-model="form.birthDate"
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
                v-model="form.city"
                :items="cities"
                label="City"
                placeholder="Select City"
                multiple
              />
            </v-col>
            <v-col cols="12">
              <v-label>Gender</v-label>
              <v-radio-group
                v-model="form.gender"
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
                  v-model="form.selectedLanguages"
                  hide-details
                  color="primary"
                  density="compact"
                  :rules="[requiredRule]"
                />
              </div>
            </v-col>
            <v-col cols="12">
              <v-label>File</v-label>
              <v-file-input
                variant="outlined"
                density="compact"
                :rules="[requiredRule]"
                hide-details="auto"
                v-model="form.file"
                label="file"
                accept="image/jpeg,application/pdf"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" rounded="lg" @click="handleSubmit">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
