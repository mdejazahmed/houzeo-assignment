
import defaultLayout from '@/layouts/defaultLayout.vue'
import { ROUTES } from '@/constants/routeKeys'
export const routes = [
  {
    path: ROUTES.HOME.path,
    name: ROUTES.HOME.name,
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: 'Home',
      requiresAuth: false,
      layout: defaultLayout
    }
  },
  // Not Found Route
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('@/pages/not-found.vue'),
    meta: {
      title: 'Page Not Found',
      requiresAuth: false
    }
  }
]