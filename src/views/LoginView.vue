<template>
  <div class="flex items-center justify-center w-full h-screen bg-white">
    <div class="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Einloggen</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" action="#" method="POST">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-900">Email</label>
            <div class="mt-2">
              <input v-model="email" type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm" />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-gray-900">Passwort</label>
              <div class="text-sm">
                <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Passwort vergessen?</a>
              </div>
            </div>
            <div class="mt-2">
              <input v-model="password" type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm" />
            </div>
          </div>

          <div>
            <button @click="logInUser" type="button" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-indigo-600">Sign in</button>
          </div>
        </form>

        <p class="mt-10 text-center text-sm text-gray-500">
          Noch keinen Account?
          <a href="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Erstelle deinen Account</a>
        </p>
      </div>
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
    // FOR DEBUG ONLY!
    authService.logInUser(email.value, password.value)
    console.log('Login user: ' + email.value + ' ' + password.value)
    router.push('/dashboard')
}
</script>