
import authLayout from '@/layouts/auth.vue'
import defaultLayout from '@/layouts/default.vue'
import {ROUTES} from '@/constants/routeKeys'

export const routes = [
    // Auth Routes
    {
        name: ROUTES.LOGIN.name,
        path: ROUTES.LOGIN.path,
        component: () => import('@/pages/auth/login.vue'),
        meta: {
          title: 'Login',
          layout: authLayout,
          requiresAuth: false
        }
      },
    // App Routes
    {
        name: ROUTES.HOME.name,
        path: ROUTES.HOME.path,
        component: () => import('@/pages/app/home/home.vue'),
        meta: {
          title: 'Home',
          layout: defaultLayout,
          requiresAuth: true
        }
      },
    {
        name: ROUTES.PROJECT.name,
        path: ROUTES.PROJECT.path,
        component: () => import('@/pages/app/home/project.vue'),
        meta: {
          title: 'Project',
          requiresAuth: true
        }
      },
      // Weekly Plan Routes
    {
        name: ROUTES.WEEKLY_PLANS.name,
        path: ROUTES.WEEKLY_PLANS.path,
        component: () => import('@/pages/app/weeklyPlans/weeklyPlans.vue'),
        meta: {
          title: 'Weekly Plan',
          requiresAuth: true,
          layout: defaultLayout,
        }
      },
    {
        name: ROUTES.CREATE_WEEKLY_PLAN.name,
        path: ROUTES.CREATE_WEEKLY_PLAN.path,
        component: () => import('@/pages/app/weeklyPlans/createWeeklyPlan.vue'),
        meta: {
          title: 'Create Weekly Plan',
          requiresAuth: true,
        
        }
      },
    {
        name: ROUTES.EDIT_WEEKLY_PLAN.name,
        path: ROUTES.EDIT_WEEKLY_PLAN.path,
        component: () => import('@/pages/app/weeklyPlans/editWeeklyPlan.vue'),
        meta: {
          title: 'Edit Weekly Plan',
          requiresAuth: true,
        }
      },
    {
        name: ROUTES.VIEW_WEEKLY_PLAN.name,
        path: ROUTES.VIEW_WEEKLY_PLAN.path,
        component: () => import('@/pages/app/weeklyPlans/viewWeeklyPlan.vue'),
        meta: {
          title: 'View Weekly Plan',
          requiresAuth: true,
        }
      },
      // Task List Routes
    {
        name: ROUTES.TASK_LIST.name,
        path: ROUTES.TASK_LIST.path,
        component: () => import('@/pages/app/taskList/taskList.vue'),
        meta: {
          title: 'Task List',
          requiresAuth: true,
          layout: defaultLayout,
        }
      },
    // Not Found Route
    {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/pages/not-found.vue'),
    meta: {
      title: 'Page Not Found',
      layout: authLayout,
      requiresAuth: false
    }
  }
]