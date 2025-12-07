<template>
  <div class="bg-[url('@/assets/images/background-login.jpg')] bg-cover bg-center h-screen relative">
    <div class="h-full w-auto rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-95 p-4 flex flex-col justify-center items-center">
      <p class="text-white text-[80px] text-5xl py-4">Timemanager</p>
      <div class="bg-primary h-1/2 w-full rounded-lg flex flex-col p-4">
        <BaseTabBar v-model="selectedTab" :tabs="['Sign In', 'Register']" />
        <template v-if="selectedTab === 0">
          <div class="flex flex-col gap-4 h-full px-4 py-10">
            <BaseInput label="E-Mail" />
            <span class="relative flex flex-col last:items-end">
              <BaseInput label="Passwort" />
              <p class="text-xs hover:underline select-none items-end">Passwort vergessen?</p>
            </span>
            <BaseButton class="w-32 flex">Sign In</BaseButton>
          </div>
        </template>
        <template v-else-if="selectedTab === 1"></template>
      </div>
    </div>
  </div>
</template>

  

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../services/AuthService'
import BaseInput from '@/components/base/Input.vue'
import BaseButton from '@/components/base/Button.vue'
import BaseTabBar from '@/components/base/Tabbar.vue'

const selectedTab = ref(0)

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