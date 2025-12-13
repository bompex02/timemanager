<template>
  <div class="bg-[url('@/assets/images/background-login.jpg')] bg-cover bg-center h-screen relative">
    <div class="h-full w-auto rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-95 p-4 flex flex-col justify-center items-center">
      <p class="text-white text-[80px] text-5xl py-4">Timemanager</p>
      <div class="bg-primary h-1/2 w-full rounded-lg flex flex-col p-4">
        <BaseTabBar v-model="selectedTab" :tabs="['Sign In', 'Register']" />
          <div class="flex flex-col gap-2 h-full px-4 py-10">
            <div class="flex flex-row" v-if="selectedTab === 1">
              <BaseInput label="Vorname" />
              <BaseInput label="Nachname" />
            </div>
            <BaseInput label="E-Mail" />
            <span class="relative flex flex-col last:items-end">
              <BaseInput label="Passwort" type="password" />
              <p class="text-xs hover:underline select-none flex justify-end px-2 pt-0.5">Passwort vergessen?</p>
            </span>
            <BaseButton class="w-32">{{selectedTab === 0 ? logInUser : registerUser }}</BaseButton>
          </div>
      </div>
    </div>
  </div>
</template>

  

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '../types/user'
import { useRouter } from 'vue-router'
import { AuthService } from '../services/AuthService'
import BaseInput from '@/components/base/Input.vue'
import BaseButton from '@/components/base/Button.vue'
import BaseTabBar from '@/components/base/Tabbar.vue'

const router = useRouter()
const authService = AuthService.getInstance()

const selectedTab = ref(0)
const input = ref<User>({
  firstName: '',
  lastName: '',
  eMail: '',
  password: '',
})

function isFilled(value: string | undefined): boolean {
  return (value && typeof value === 'string') as boolean
}
const allFilled = computed(() => Object.values(input.value).every(isFilled))

const logInUser = (event: Event) => {
    event.preventDefault(); // Prevent form submission
    authService.logInUser(input.value.eMail, input.value.password, router);
    // ----------------------FOR DEBUG ONLY!--------------------------
    console.log('Login user: ' + input.value.eMail + ' ' + input.value.password)
    // ---------------------------------------------------------------
}

async function registerUser(event: Event) {
  if (!allFilled.value) {
    console.log("Die Inputs sind leer")
  }
  console.log("Das sollte nicht passieren")
  event?.preventDefault()
  authService.registerUser(input.value.eMail, input.value.password, input.value.firstName, input.value.lastName)

}

</script>