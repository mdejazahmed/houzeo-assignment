
export const ROUTES = {
    LOGIN: {
      name: "login",
      path: "/login",
    },  
    HOME: {
      name: "home",
      path: "/home",
    },  
    PROJECT: {
      name: "project",
      path: "/project/:project_id",
    },  
    WEEKLY_PLANS: {
      name: "weekly_plans",
      path: "/weekly_plans",
    },
    CREATE_WEEKLY_PLAN: {
      name: "create_weekly_plan",
      path: "/create_weekly_plan/:weekly_plan_id",
    },
    VIEW_WEEKLY_PLAN: {
      name: "view_weekly_plan",
      path: "/weekly_plan/:weekly_plan_id",
    },
    EDIT_WEEKLY_PLAN: {
      name: "edit_weekly_plan",
      path: "/edit_weekly_plan/:weekly_plan_id",
    },
    TASK_LIST: {
      name: "task_list",
      path: "/task_list",
    },
}   