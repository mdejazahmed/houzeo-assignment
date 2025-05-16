/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useLoadingStore } from '@/stores/loading'
import { useRoute } from 'vue-router'
import {routes} from './routes'
import {ROUTES} from '@/constants/routeKeys'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

// Global Before Each Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const loadingStore = useLoadingStore()

  try {
    // 1. Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth
    const requiresRole = to.meta.requiresRole
    const requiresPermission = to.meta.requiresPermission

    // 2. Check authentication status
    if (requiresAuth) {
      // Check if already authenticated
      if (!authStore.isAuthenticated) {
        // Check auth status if not already authenticated
        const isAuthenticated = await authStore.checkAuth()
        if (!isAuthenticated && to.name !== ROUTES.LOGIN.name) {
          next(ROUTES.LOGIN.name)
          return
        }
      }
    }

    // 3. Check role-based access
    if (requiresRole && authStore.isAuthenticated) {
      const hasRole = userStore.hasRole(requiresRole)
      if (!hasRole) {
        next('/403')
        return
      }
    }

    // 4. Check permission-based access
    if (requiresPermission && authStore.isAuthenticated) {
      const hasPermission = userStore.hasPermission(requiresPermission)
      if (!hasPermission) {
        next('/403')
        return
      }
    }

    // 5. Handle public routes and prevent authenticated users from accessing login/register
    if (!requiresAuth && authStore.isAuthenticated) {
      // Get the current route name
      const currentRouteName = to.name
      // Get the route keys
      const { LOGIN, REGISTER } = ROUTES
      
      // If user is trying to access login or register page while authenticated
      if (currentRouteName === LOGIN.name || currentRouteName === REGISTER.name) {
        // Redirect to dashboard
        next(from)
        return
      }
      
      // For other public routes, allow access
      next()
      return
    }

    // 6. Set page title
    const defaultTitle = 'CodeNicely Core'
    const pageName = to.meta.title || to.name
    document.title = pageName ? `${pageName} | ${defaultTitle}` : defaultTitle

    // 7. Preload data if needed
    if (to.meta.preloadData) {
      await userStore.fetchUserData()
    }

    // 8. Call any route-specific guards
    if (to.meta.beforeEnter) {
      const result = await to.meta.beforeEnter(to, from)
      if (result === false) {
        return
      }
    }

    next()
  } catch (error) {
    console.error('Router guard error:', error)
    next('/error')
  } finally {
    loadingStore.clearLoading()
  }
})

// Global After Each Guard
router.afterEach((to, from) => {
  const loadingStore = useLoadingStore()


  // Track page views
  if (to.meta.trackPageView) {
    // Implement your analytics tracking here
    console.log('Tracked page view:', to.path)
  }

  // Handle scroll position
  if (to.meta.scrollToTop) {
    window.scrollTo(0, 0)
  }

  // Handle layout changes
  if (to.meta.layout) {
    console.log('Using layout:', to.meta.layout)
  }

  // Log navigation
  console.log(`Navigated from ${from.path} to ${to.path}`)
})

// Handle route changes
router.beforeResolve((to, from) => {
  // This guard runs after all other guards but before the route is confirmed
  // Useful for additional checks before the route is fully resolved
  if (to.meta.beforeResolve) {
    to.meta.beforeResolve(to, from)
  }
})

// Original isReady code
router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
