<template>
  <div class="bg-[url('@/assets/images/background-login.jpg')] bg-cover bg-center h-screen grid grid-cols-5">
    <div class="col-start-4 col-span-2 p-4 bg-primary text-white">
      <h1>Timemanager</h1>
      <p class="heading-1">Sign in</p>
      <p class="font-extralight">wjwj</p>
    </div>
  </div>
</template>

  

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../services/AuthService'

const email = ref('')
const password = ref('')
const router = useRouter()
const authService = AuthService.getInstance()

const logInUser = (event: Event) => {
    event.preventDefault(); // Prevent form submission
    authService.logInUser(email.value, password.value, router);
    // ----------------------FOR DEBUG ONLY!--------------------------
    console.log('Login user: ' + email.value + ' ' + password.value)
    // ---------------------------------------------------------------
}
</script>