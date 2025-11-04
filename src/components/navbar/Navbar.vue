<template>
  <div class="h-full flex flex-col p-4 w-[20rem] shadow-lg shadow-gray-500">
    <div class="flex-1 flex flex-col gap-3">
      <p class="pb-5 select-none">Timemanager</p>
      <div class="w-full flex flex-col" v-for="item in MenuItems" :key="item">
        <router-link :to="item.path" class="select-none w-full p-2 rounded-lg" :class="[route.path === item.path ? 'bg-gray-300 hover:bg-gray-200 shadow-inner' : 'hover:bg-gray-300']">{{item.text}}</router-link>
      </div>
    </div>
    <div class="flex w-full items-center">
      <p class="flex-1">
        (CurrentUserPlaceholer)
      </p>
      <div class="">
        <button @click="handleLogOut" class="hover:bg-gray-300 p-2 rounded-lg">
          <ArrowRightStartOnRectangleIcon class="size-6" />
        </button>
      </div>
    </div>
  </div>
</template>


<script setup>
import 'primeicons/primeicons.css'
import {MenuItems} from "@/components/navbar/menu-items.ts";
import { onMounted, ref, watch } from 'vue'
import { UserService } from '../../services/UserService.js'
import { AuthService } from '../../services/AuthService.js';
import { ProjectService } from '../../services/ProjectService.js';
import { useRouter, useRoute } from 'vue-router'
import { projectCountEvent } from '../../eventBus.js';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/solid'

const userService = UserService.getInstance();
const authService = AuthService.getInstance();
const projectService = ProjectService.getInstance();

const router = useRouter();
const route = useRoute()

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

watch(projectCountEvent, async () => {
  // every time a project is added, fetch the new count
  await fetchProjectCount();
});


</script>
