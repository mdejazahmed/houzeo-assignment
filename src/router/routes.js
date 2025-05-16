
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
        component: () => import('@/pages/app/home.vue'),
        meta: {
          title: 'Home',
          layout: defaultLayout,
          requiresAuth: true
        }
      },
    {
        name: ROUTES.PROJECT.name,
        path: ROUTES.PROJECT.path,
        component: () => import('@/pages/app/project.vue'),
        meta: {
          title: 'Project',
          requiresAuth: true
        }
      },
      // Weekly Plan Routes
    {
        name: ROUTES.WEEKLY_PLAN.name,
        path: ROUTES.WEEKLY_PLAN.path,
        component: () => import('@/pages/app/weeklyPlan.vue'),
        meta: {
          title: 'Weekly Plan',
          requiresAuth: true,
          layout: defaultLayout,
        }
      },
    {
        name: ROUTES.CREATE_WEEKLY_PLAN.name,
        path: ROUTES.CREATE_WEEKLY_PLAN.path,
        component: () => import('@/pages/app/createWeeklyPlan.vue'),
        meta: {
          title: 'Create Weekly Plan',
          requiresAuth: true,
        
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