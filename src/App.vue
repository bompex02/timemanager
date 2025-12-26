<!-- App.vue -->
<template>
  <div class="flex min-h-screen">
    <template v-if="showSidebar">
      <Navbar />
      <div class="w-[20rem] shrink-0"></div>
    </template>
    <div class="flex-1 min-h-screen bg-white">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/navbar/Navbar.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showSidebar = computed(() => !route.meta.hideLayout)
</script>
