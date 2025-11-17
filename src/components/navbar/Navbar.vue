<template>
  <div class="h-full flex flex-col p-4 w-[20rem] shadow-lg shadow-gray-500">
    <div class="flex-1 flex flex-col gap-3">
      <p class="pb-5 select-none">Timemanager</p>
      <div class="w-full flex items-center" v-for="item in MenuItems" :key="item">
        <router-link :to="item.path" class="select-none relative w-full p-2 rounded-lg flex gap-2" :class="[route.path === item.path ? 'bg-gray-300 group-[]:bg-gray-300 hover:bg-gray-200 shadow-inner' : 'hover:bg-gray-300']">
          <p>{{ item.text }}</p>
          <p v-if="item.path === '/projects'" class="bg-gray-400 size-6 inline-flex items-center justify-center absolute left-1/4 rounded-full top-auto text-sm">
            {{ projectCount }}
          </p>
        </router-link>
      </div>
    </div>
    <div class="flex w-full items-center">
      <p class="flex-1 truncate">
        {{ userDisplayName }}
      </p>
      <div>
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

const userDisplayName = ref('');

// Logs out the user via authService
const handleLogOut = () => {
  console.log('Logout User: ', userService.currentUser)
  authService.logOutUser(router);
  router.push('/login')
}

async function fetchProjectCount() {
  try {
    if (userService.getCurrentUser()){
      projectCount.value = await projectService.getProjectCountForUser(userService.getCurrentUser().id);
    }
  } catch (error) {
    console.error('Error fetching project count:', error);
  }
}

function getUserDisplayName() {
  const currentUser = userService.getCurrentUser();
  if (currentUser) {
    userDisplayName.value = currentUser.getDisplayName();
  }
}

onMounted(() => {
  // fetch initial project count on component mount
  fetchProjectCount();
  getUserDisplayName();
});

watch(projectCountEvent, async () => {
  // every time a project is added, fetch the new count
  await fetchProjectCount();
  getUserDisplayName();
});


</script>
