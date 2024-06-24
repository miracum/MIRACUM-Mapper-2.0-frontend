import { createRouter, createWebHistory } from 'vue-router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/loggedIn/DashboardView.vue';

// import keycloak from '../keycloak'; // Adjust the path as necessary
import { useAuthStore } from '../stores/auth';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    // meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    component: DashboardView, // This serves as a wrapper for your nested routes
    meta: { requiresAuth: true },
    // children: [
    //   { path: 'projects', component: ProjectsPage, children: [] },
    //   { path: 'settings', component: SettingsPage },
    //   // Add more nested routes as needed
    // ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth ) && !authStore.isAuthenticated) { // && !keycloak.authenticated
    next('/login'); // Redirect to login if not authenticated and trying to access a protected route
  } else if (to.path === '/login' && authStore.isAuthenticated) { // && keycloak.authenticated
    next('/dashboard'); // Redirect to dashboard if already authenticated and trying to access login
  } else {
    next(); // Proceed as normal if none of the above conditions are met
  }
});

export default router;