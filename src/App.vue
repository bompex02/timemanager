<!-- App.vue -->
<template>
 <div class="flex">
  <template v-if="!$route.meta.hideLayout">
      <Navbar />
    </template>
    <div class="bg-white" :class="containerStyling">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/navbar/Navbar.vue'
import { RouterView } from 'vue-router'
import { UserService } from './services/UserService';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const user = UserService.getInstance()

const containerStyling = computed(() => {
  if (!user.currentUser) 
    return 'flex-1'
  return 'w-[calc(100%-20rem)]'
})

async function checkForLoggedInUser() {
  if (!user.currentUser)
    router.push({path: '/login'})
  else
    console.log('Nutzer ist eingeloggt')

}

onMounted(() => {
  checkForLoggedInUser()
})
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
