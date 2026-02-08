<template>
  <div class="bg-login text-white h-full flex items-center justify-center relative">
    <div class="w-full flex flex-col items-center">
      <ChroniqIcon class="p-4 size-1/5" />
      <div class="border-4 border-white glass-card rounded-lg py-6 px-12 flex flex-col gap-4 w-1/4">
        <BaseTabBar
          v-model="selectedTab"
          :tabs="[t('signIn'), t('signUp')]"
          class="mb-2"
        />
        <Transition>
          <div
            v-if="selectedTab === 1"
            class="space-y-4"
          >
            <BaseInput
              v-model="firstName"
              :label="t('firstName')"
              required
            />
            <BaseInput
              v-model="lastName"
              :label="t('lastName')"
              required
            />
          </div>
        </Transition>
        <BaseInput
          v-model="email"
          :label="t('email')"
          type="text"
          required
        />
        <BaseInput
          v-model="password"
          type="password"
          :label="t('password')"
          required
        />
        <BaseButton
          variant="primary"
          :disabled="isLoggingIn"
          @click="handleSubmit"
        >
          <span v-if="isLoggingIn">{{ t('loading') }}...</span>
          <span v-else>{{ selectedTab === 0 ? t('login') : t('register') }}</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChroniqIcon from '~/assets/svg/chroniq.svg'

const { login, register, isLoggingIn } = useAuth()
const { t } = useI18n()
const toast = useToast()

const selectedTab = ref<number>(0)
const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')

// handle form submit for login/register
const handleSubmit = async () => {
  // validation checks
  if (!email.value || !password.value) {
    toast.error({
      title: t('toastErrorTitle'),
      message: t('emailAndPasswordRequired'),
    })
    return
  }

  // additional checks for registration
  if (selectedTab.value === 1 && (!firstName.value || !lastName.value)) {
    toast.error({
      title: t('toastErrorTitle'),
      message: t('allFieldsRequired'),
    })
    return
  }

  if (selectedTab.value === 0) {
    // Login
    await login(email.value, password.value)
  }
  else {
    // Register
    await register(email.value, password.value, firstName.value, lastName.value)
  }
}

// reset form and errors when switching tabs
watch(selectedTab, () => {
  email.value = ''
  password.value = ''
  firstName.value = ''
  lastName.value = ''
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
