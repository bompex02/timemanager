<!-- App.vue -->
<template>
  <div class="sidebar-container" v-if="!$route.meta.hideLayout">
    <Navbar />
  </div>
  <div class="content-container bg-white">
    <RouterView />
  </div>
</template>

<script setup>
import Navbar from './components/navbar/Navbar.vue'
import { RouterView } from 'vue-router'
import { UserService } from './services/UserService';

const userService = UserService.getInstance();
console.log('Current User:', userService.getCurrentUser());

</script>

<style scoped>
.sidebar-container {
  position: fixed;   /* Fixiert die Sidebar am Viewport */
  top: 0;            /* Obere Kante am oberen Rand */
  left: 0;           /* Linke Kante am linken Rand */
  height: 100vh;     /* Höhe entspricht 100% der Viewport-Höhe */
  width: 20rem;      /* Breite der Sidebar – hier anpassbar */
  z-index: 100;      /* Damit die Sidebar über anderen Inhalten liegt */
}

.content-container {
  flex-grow: 1;
  margin-left: 20rem; /* Platz für die Sidebar */
  padding: 2rem; /* Etwas Innenabstand */
}

</style>
