import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import LandingPageView from '../views/LandingPageView.vue'
import LoginView from '../views/LoginView.vue'
import ProjectList from '../views/loggedIn/Project/ProjectView.vue'
import MappingView from '../views/loggedIn/MappingView.vue'
import EditProjectView from '../views/loggedIn/Project/EditProjectView.vue'
import { watch } from 'vue'

// import keycloak from '../keycloak'; // Adjust the path as necessary
import { useAuthStore } from '../stores/auth'
import AddProjectView from '@/views/loggedIn/Project/AddProjectView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPageView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
    // meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    component: ProjectList,
    meta: { requiresAuth: true }
    // children: [
    //   {
    //     path: '/projects/:projectId/mappings',
    //     component: MappingView,
    //     meta: { requiresAuth: true }
    //   }
    // ]
  },
  {
    path: '/dashboard/projects/:projectId/mappings',
    name: 'MappingView',
    component: MappingView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/dashboard/projects/:projectId/edit',
    name: 'EditProjectView',
    component: EditProjectView,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/dashboard/projects/add',
    name: 'AddProjectView',
    component: AddProjectView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()

    // let lastNavigation: string

    const checkAuthentication = () => {
      if (to.matched.some((record) => record.meta.requiresAuth) && !authStore.authenticated) {
        next('/login') // Redirect to login if not authenticated and trying to access a protected route
      } else if (
        to.matched.some((record) => !record.meta.requiresAuth) &&
        authStore.authenticated
      ) {
        next('/dashboard') // Redirect to dashboard if already authenticated and trying to access a non-protected route
      } else if (to.path.includes('/login') && authStore.authenticated) {
        next('/dashboard') // Redirect to dashboard if already authenticated and trying to access login
      } else {
        next() // Proceed as normal if none of the above conditions are met
      }
    }

    // logout is treated as a special case, is it is only a temporary route to log the user out and redirect to the start page
    if (!to.path.includes('/logout')) {
      const authenticated = authStore.authenticated
      if (!to.path.includes('/login') || authenticated || authStore.initialized === true) {
        checkAuthentication()
      }
      if (authStore.initialized === false) {
        const unwatch = watch(
          () => authStore.initialized,
          (newValue) => {
            if (newValue !== false) {
              unwatch()
              if (authenticated != authStore.authenticated || to.path.includes('/login'))
                checkAuthentication()
            }
          }
        )
      }
    }
  }
)

export default router
