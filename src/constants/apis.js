//login
export const LOGIN = '/user/user_register/'
//home
export const GET_MEMBERS_LIST = '/project/members/list/'
export const CREATE_PROJECT = '/project/create_project/'
export const GET_PROJECTS_LIST = '/project/get_project/list/'
export const DELETE_PROJECT = '/project/delete_project/:project_id'
//project
export const GET_PROJECT = '/project/get_project/details/:project_id'
export const ADD_TEAM_MEMBER = '/project/add_member_to_project/'
export const REMOVE_TEAM_MEMBER = '/project/remove_member_to_project/:member_assigned_project_id/'
//group
export const CREATE_GROUP = '/project/create_projects_group/'
export const GET_GROUPS = '/project/get_projects_group/list/:project_id'
export const GET_PROJECT_TEAMS = '/project/get_project_teams/list/:project_id/'
//task
export const GET_PROJECT_TEAM_LIST = '/project/get_project_teams/list/:project_id'
export const CREATE_TASK = '/project/task/create_task/'
export const MARK_TASK_COMPLETED = '/project/task/update_task_status/:task_id/'
export const GET_TASK_LIST = '/project/get_weekly_task_list/'

//weekly plan
export const CHECK_USER_WEEKLY_PLAN = '/project/check_user_weekly_plan_details/'
export const GET_WEEKLY_PLAN_TABS = '/project/weekly_plan/get_project_weekly_plan/tab_list/'
export const GET_WEEKLY_PLAN_LIST = '/project/weekly_plan/get_weekly_plan/list/'
export const GET_PROJECT_PENDING_TASKS = '/project/weekly_plan/project_details/:project_id/'
export const GET_WEEKLY_PLAN_DETAILS = '/project/weekly_plan/get_weekly_plan/details/:weekly_plan_id/'
export const MOVE_TASK = '/project/weekly_plan/move_task/'
export const REMOVE_TASK = '/project/weekly_plan/remove_task/'
export const CHANGE_WEEKLY_PLAN_STAGE = '/project/weekly_plan/update_weekly_plan_stage/:weekly_plan_id/'








