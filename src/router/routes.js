
import authLayout from '@/layouts/auth.vue'
import defaultLayout from '@/layouts/default.vue'
import {ROUTES} from './routeKeys'

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