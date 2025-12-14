<template>
  <div class="bg-[url('@/assets/images/background-login.jpg')] bg-cover bg-center h-screen relative bg-zinc-300 bg-blend-multiply">
    <div class="h-full w-auto min-w-1/4 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-95 p-4 flex flex-col justify-center items-center last:gap-2">
      <img src="@/assets/images/logoAlt2.png" />
      <div class="h-auto w-full rounded-xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-lg flex flex-col p-4 overflow-auto">
        <BaseTabBar v-model="selectedTab" :tabs="['Sign In', 'Register']" />
          <form class="flex flex-col gap-2 h-full px-4 py-10" @submit.prevent="handleSubmit">
            <Transition>
              <div class="flex flex-row" v-if="selectedTab === 1">
                <BaseInput v-model="input.firstName" variant="primary" label="Firstname" required />
                <BaseInput v-model="input.lastName" variant="primary" label="Lastname" required />
              </div>
            </Transition>
            <BaseInput v-model="input.eMail" variant="primary" label="E-Mail" required />
            <span class="relative flex flex-col last:items-end">
              <BaseInput v-model="input.password" password variant="primary" label="Password" type="password" required />
              <!-- <p class="text-white text-xs hover:underline select-none flex justify-end px-2 pt-0.5">Passwort vergessen?</p> -->
            </span>
            <BaseButton class="w-32" type="submit">{{selectedTab === 0 ? 'Sign In' : 'Register'}}</BaseButton>
          </form>
      </div>
    </div>
  </div>
</template>

  

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../types/user'
import { AuthService } from '../services/AuthService'
import { showError } from '../services/ToastService'
import BaseInput from '@/components/base/Input.vue'
import BaseButton from '@/components/base/Button.vue'
import BaseTabBar from '@/components/base/Tabbar.vue'

const authService = AuthService.getInstance()
const router = useRouter()

const selectedTab = ref(0)
const input = ref<User>({
  firstName: '',
  lastName: '',
  eMail: '',
  password: '',
})
const allFilled = computed(() => Object.values(input.value).every(isFilled))
const isFilled = (value: string | undefined): boolean => {
  return (value && typeof value === 'string') as boolean
}

const handleSubmit = () => {
  switch (selectedTab.value) {
    case 0:
      logInUser()
      break
    case 1:
      registerUser()
      break
  }

}

const logInUser = async () => {
  if (!input.value.eMail || !input.value.password) {
   showError('Bitte alle erforderlichen Felder ausfüllen')
   return
  }
  await authService.logInUser(input.value.eMail, input.value.password, router)
}

const registerUser = async () => {
  if (!allFilled.value) {
    showError('Bitte alle erforderlichen Felder ausfüllen')
    return
  }
  if (input.value.password!.length < 6) {
    showError('Das Passwort muss mindestens 6 Zeichen lang sein')
    return
  }
  try {
    await authService.registerUser(input.value.eMail, input.value.password, input.value.firstName, input.value.lastName, router)
    await logInUser()
  } catch (error) {
    console.error('❌ Fehler bei der Registrierung:', error)
  }
}

</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>