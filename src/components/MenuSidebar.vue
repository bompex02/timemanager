<template>
  <div
    class="relative flex h-screen w-full max-w-[20rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
    <div class="p-4 mb-2">
      <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Sidebar
      </h5>
    </div>

    <nav class="flex flex-col flex-grow gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
      <router-link
        @click="handleClick('dashboard')"
        to="/dashboard"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-chart-bar"></i>
        </div>
        Dashboard
      </router-link>

      <router-link
        @click="handleClick('timerecording')"
        to="/timerecording"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-clock"></i>
        </div>
        Zeiterfassung
      </router-link>

      <router-link
        @click="handleClick('calender')"
        to="/calender"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-calendar"></i>
        </div>
        Kalender        
      </router-link>

      <router-link
        @click="handleClick('projects')"
        to="/projects"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-briefcase"></i>
        </div>
        Projekte
        <!-- Für die kleine Zahl oben neben dem Button -->
        <div class="grid ml-auto place-items-center justify-self-end">
          <div
            class="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900 cursor-pointer">
            <span class="">{{projectCount}}</span>
          </div>
        </div>
        <!---->
      </router-link>

      <router-link
        @click="handleClick('settings')"
        to="/settings"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-cog"></i>
        </div>
        Settings
      </router-link>

      <router-link
        @click="handleClick('login')"
        to="/login"
        class="mt-auto flex items-bottom gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-sign-in"></i>
        </div>
        Log In
      </router-link>

      <button
        @click="handleClick('logout'); handleLogOut()"       
        class="mt-auto flex items-bottom gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-sign-out"></i>
        </div>
        Log Out
      </button>
    </nav>
  </div>
</template>


<script setup>
import 'primeicons/primeicons.css'
import { onMounted, ref, watch } from 'vue'
import { UserService } from '../services/UserService'
import { AuthService } from '../services/AuthService';
import { ProjectService } from '../services/ProjectService';
import { useRouter } from 'vue-router'
import { projectAddedEvent } from '../eventBus';

const userService = UserService.getInstance();
const authService = AuthService.getInstance();
const projectService = ProjectService.getInstance();

const router = useRouter();

const projectCount = ref(0);

// Logs the clicked button for debug in the browser console
const handleClick = (componentName) => {
  console.log('Button Clicked: => ', componentName)
}

// Logs out the user via authService
const handleLogOut = () => {
  console.log('Logout User: ', userService.currentUser)
  authService.logOutUser(router);
}

async function fetchProjectCount() {
  try {
    projectCount.value = await projectService.getProjectCountForUser(userService.getCurrentUser().id);
  } catch (error) {
    console.error('Error fetching project count:', error);
  }
}

onMounted(fetchProjectCount);

watch(projectAddedEvent, async () => {
  // every time a project is added, fetch the new count
  await fetchProjectCount();
});


</script>
