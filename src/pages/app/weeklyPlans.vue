<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import request from "@/plugins/axios";
import { GET_WEEKLY_PLAN_TABS, GET_WEEKLY_PLAN_LIST } from "@/constants/apis";
import { ROUTES } from "@/constants/routeKeys";
const route = useRoute();
const router = useRouter();
const tabs = ref([]);
const isLoading = ref(true);
const headers = [
  { title: "Week", key: "week", align: "left" },
  { title: "Due Date", key: "due_date", align: "left" },
  { title: "Status", key: "status", align: "left" },
  { title: "Overdue Days", key: "overdue_days", align: "left" },
  { title: "Action", key: "action", align: "center",width: "300px" },
];
const items = ref([]);
const loadingTable = ref(false);
// Computed property to get the initial tab value from URL
const initialTab = computed(() => route.query.tab || "Pending");

// Reactive tab state
const activeTab = ref(initialTab.value);

// Computed property to update URL when tab changes
const tabValue = computed({
  get: () => activeTab.value,
  set: (value) => {
    activeTab.value = value;
    router.push({ query: { tab: value } });
  },
});

const getWeeklyPlanTabs = async () => {
  try {
    const res = await request.get(GET_WEEKLY_PLAN_TABS);
    tabs.value = res.data?.detail || [];
  } catch (error) {
    console.error("Error fetching tabs:", error);
    tabs.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Fetch tabs when component is mounted

const getWeeklyPlanData = async () => {
loadingTable.value = true;
  try {
    const res = await request.get(GET_WEEKLY_PLAN_LIST, {
      params: {
        plan_tabs: activeTab.value,
      },
    });
    items.value = res.data?.detail || [];
  } catch (error) {
    console.error("Error fetching weekly plan data:", error);
    items.value = [];
  }finally {
    loadingTable.value = false;
  }
};
onMounted(async () => {
  await getWeeklyPlanTabs();
  getWeeklyPlanData();
});

const handleBtnClick = (btn,weekly_plan_id) => {
switch (btn.key) {
  case "create_plan":
    router.push({ name: ROUTES.CREATE_WEEKLY_PLAN.name, params: { weekly_plan_id } });
    break;
  case "edit_plan":
    router.push({ name: ROUTES.EDIT_WEEKLY_PLAN.name, params: { weekly_plan_id } });
    break;
  case "view_plan":
    router.push({ name: ROUTES.VIEW_WEEKLY_PLAN.name, params: { weekly_plan_id } });
    break;
}
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h5 class="text-h5 font-weight-bold">Weekly Plan 🚀</h5>
        <p class="text-subtitle-2 text-medium-emphasis">Weekly Plan</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card variant="flat" class="rounded-lg" > 
          <v-card-text>
            <Tabs v-model="tabValue" :tabs="tabs" @update:modelValue="getWeeklyPlanData" />
            <CustomeTable :headers="headers" :items="items" class="mt-4" :loading="loadingTable" >
              <template #status="{ item }">
                <v-chip
                  :color="item.status.color"
                  :text="item.status.text"
                  prepend-icon="mdi-circle"
                  size="small"
                >
                </v-chip>
              </template>
              <template #overdue_days="{ item }">
                <div class="text-error">
                  {{ item.overdue_days || "--" }}
                </div>
              </template>
              <template #action="{ item }">
                <DynamicButtons :dynamicButtons="item.action_button" size="small" @click="(btn) => handleBtnClick(btn,item.id)"/>
              </template>
            </CustomeTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.v-data-table {
  background-color: transparent;
}
.v-data-table::v-deep(.v-data-table__td) {
  border-bottom: none !important;
}
</style>
