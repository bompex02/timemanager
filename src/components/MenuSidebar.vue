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
        @click="handleClick('e-commerce')"
        to="/e-commerce"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-shopping-cart"></i>
        </div>
        E-Commerce
      </router-link>

      <router-link
        @click="handleClick('inbox')"
        to="/inbox"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-inbox"></i>
        </div>
        Inbox
        <div class="grid ml-auto place-items-center justify-self-end">
          <div
            class="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900 cursor-pointer">
            <span class="">14</span>
          </div>
        </div>
      </router-link>

      <router-link
        @click="handleClick('profile')"
        to="/profile"
        class="flex items-center gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-users"></i>
        </div>
        Profile
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
        @click="handleClick('logout')"
        to="/logout"
        class="mt-auto flex items-bottom gap-x-2 w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 cursor-pointer">
        <div class="grid mr-4 place-items-center">
          <i class="pi pi-sign-out"></i>
        </div>
        Log Out
      </router-link>
    </nav>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import 'primeicons/primeicons.css'

const handleClick = (componentName) => {
  console.log('Button Clicked: => ', componentName)
}

</script>