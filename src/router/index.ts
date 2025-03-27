import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DashboardView from '@/views/DashboardView.vue'
import TimerecordingView from '@/views/TimerecordingView.vue' 
import CalenderView from '@/views/CalenderView.vue'
import ReportsView from '@/views/ReportsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/timerecording',
      name: 'timerecording',
      component: TimerecordingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/calender',
      name: 'calender',
      component: CalenderView,
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
})

// route guard to check if user is logged in
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();

  // wait for auth to be loaded
  const user = await new Promise(resolve => {
    onAuthStateChanged(auth, resolve);
  });

  // if user is logged in, proceed to route
  if(!user && to.meta.requiresAuth) {
    // if user tries is not logged in and tries to access a route that requires auth, redirect to login
    next({ name: 'login' });
  } else if( user && to.path === '/login'|| to.path === '/register') {
    // if user is logged in and tries to access login or register page, redirect to dashboard
    next('/dashboard');
  } else {
    next();
  }
})

export default router
