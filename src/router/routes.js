
import defaultLayout from '@/layouts/defaultLayout.vue'
export const routes = [
  {
    path: '/',
    name: 'Home',
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