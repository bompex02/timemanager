<template>
  <div class="container mx-auto py-5 gap-4 flex flex-col">
    <!-- Header -->
    <header class="mb-2">
      <h1>
        {{ t('settings') }}
      </h1>
      <p class="text-disabled">
        {{ t('settingsAccountTitle') }}
      </p>
    </header>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex justify-center py-12"
    >
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-surface-300 border-t-text-100" />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Settings Sections -->
    <div
      v-else
      class="flex flex-col gap-4"
    >
      <!-- Profile Section -->
      <section class="box flex flex-col gap-4">
        <!-- Headline -->
        <div class="flex">
          <span>
            <h2>{{ t('settingsAccountTitle') }}</h2>
            <p class="section-headline-description">
              {{ t('settingsProfileSubtitle') }}
            </p>
          </span>
          <span class="ml-auto space-x-2">
            <BaseButton
              variant="text"
              @click="resetProfileForm"
            >
              {{ t('reset') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              :disabled="savingProfile"
              @click="saveProfile"
            >
              {{ savingProfile ? t('saving') : t('save') }}
            </BaseButton>
          </span>
        </div>
        <!-- Content -->
        <span class="grid grid-cols-2 gap-4">
          <BaseInput
            v-model="profileForm.firstName"
            :label="t('firstName')"
            required
          />
          <BaseInput
            v-model="profileForm.lastName"
            :label="t('lastName')"
            required
          />
        </span>
        <BaseInput
          v-model="profileForm.email"
          :label="t('email')"
          required
        />
      </section>
      <!-- Preferences Section -->
      <section class="box">
        <!-- Headline -->
        <div class="flex">
          <span>
            <h2>{{ t('theme') }}</h2>
            <p class="section-headline-description">
              {{ t('settingsThemeSubtitle') }}
            </p>
          </span>
        </div>
        <!-- Content -->
        <!-- TODO: Set theme on switch. In UserStore? -->
        <div class="flex gap-8">
          <BaseRadioGroup
            v-model="userStore.theme"
            class="justify-start"
            type="image"
            :initial-selection="userStore.theme"
          >
            <template #night>
              <img
                src="/icons/DarkTheme.svg"
                class="size-56"
              >
            </template>
            <template #day>
              <img
                src="/icons/LightTheme.svg"
                class="size-56"
              >
            </template>
            <template #system>
              <img
                src="/icons/SystemTheme.svg"
                class="size-56"
              >
            </template>
            <!-- <label class="relative inline-flex cursor-pointer items-center">
               <input
                 v-model="preferences.darkMode"
                 type="checkbox"
                 class="peer sr-only"
                 :aria-label="t('settingsDarkModeToggle')"
               >
               <div class="h-7 w-12 rounded-full bg-surface-300 transition peer-checked:bg-accent-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-400" />
               <div class="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
             </label> -->
          </BaseRadioGroup>
          <Separator
            orientation="vertical"
            decorative
            class="bg-text-100 w-0.5 rounded-full"
          />
          <BaseRadioGroup
            v-model="userStore.selectedLang"
            class="justify-center"
            direction="vertical"
          >
            <template #de>
              Deutsch
              <img
                src="/icons/Germany.svg"
                class="size-10"
              >
            </template>
            <template #en>
              English
              <img
                src="/icons/Uk.svg"
                class="size-10"
              >
            </template>
          </BaseRadioGroup>
        </div>
      </section>
      <div class="grid grid-cols-2 gap-4">
        <!-- Work Parameters Section -->
        <section class="box flex flex-col gap-4">
          <!-- Headline -->
          <div class="flex">
            <span>
              <h2>{{ t('settingsWorkParametersTitle') }}</h2>
              <p class="section-headline-description">
                {{ t('settingsWorkParametersSubtitle') }}
              </p>
            </span>
            <span class="ml-auto space-x-2">
              <BaseButton
                variant="text"
                @click="resetPreferences"
              >
                {{ t('reset') }}
              </BaseButton>
              <BaseButton
                variant="primary"
                :disabled="savingPreferences"
                @click="savePreferences"
              >
                {{ savingPreferences ? t('saving') : t('save') }}
              </BaseButton>
            </span>
          </div>
          <!-- Content -->
          <div class="grid grid-cols-2">
            <BaseRadioGroup
              v-model="preferences.defaultLocation"
              class="justify-start gap-12 col-span-1"
            >
              <template #office>
                <div class="flex flex-col items-center p-4 bg-surface-100 rounded-lg mb-2">
                  <BuildingOffice2Icon class="size-20" />
                  <p>{{ t('settingsLocationOffice') }}</p>
                  <p class="text-xs text-text-300">
                    {{ t('settingsLocationOfficeSubtitle') }}
                  </p>
                </div>
              </template>
              <template #homeoffice>
                <div class="flex flex-col items-center p-4 bg-surface-100 rounded-lg mb-2">
                  <HomeModernIcon class="size-20" />
                  <p>{{ t('settingsLocationHomeoffice') }}</p>
                  <p class="text-xs text-text-300">
                    {{ t('settingsLocationHomeofficeSubtitle') }}
                  </p>
                </div>
              </template>
            </BaseRadioGroup>
            <BaseNumberField
              v-model="preferences.targetHoursPerWeek"
              :label="t('settingsTargetHoursLabel')"
              required
              class="self-center"
              :min-value="0"
              :max-value="168"
            />
          </div>
        </section>
        <!-- Security Section -->
        <section class="box flex flex-col gap-4">
          <!-- Headline -->
          <div class="flex">
            <span>
              <h2>{{ t('settingsSecurityTitle') }}</h2>
              <p class="section-headline-description">
                {{ t('settingsSecuritySubtitle') }}
              </p>
            </span>
            <span class="ml-auto space-x-2">
              <BaseButton
                variant="text"
                @click="resetPreferences"
              >
                {{ t('reset') }}
              </BaseButton>
              <BaseButton
                variant="primary"
                :disabled="changingPassword"
                @click="changePassword"
              >
                {{ changingPassword ? t('saving') : t('changePassword') }}
              </BaseButton>
            </span>
          </div>
          <!-- Content -->
          <BaseInput
            v-model="passwordForm.current"
            :label="t('settingsCurrentPasswordLabel')"
            type="password"
          />
          <BaseInput
            v-model="passwordForm.new"
            :label="t('settingsNewPasswordLabel')"
            type="password"
          />
          <BaseInput
            v-model="passwordForm.confirm"
            :label="t('settingsConfirmPasswordLabel')"
            type="password"
          />
        </section>
      </div>
      <!-- Export Section -->
      <section class="box flex flex-col gap-4">
        <!-- Headline -->
        <div class="flex">
          <span>
            <h2>{{ t('settingsExportSettingsTitle') }}</h2>
            <p class="section-headline-description">
              {{ t('settingsExportSettingsSubtitle') }}
            </p>
          </span>
          <span class="ml-auto space-x-2">
            <BaseButton
              variant="text"
              @click="resetPreferences"
            >
              {{ t('reset') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              :disabled="savingPreferences"
              @click="savePreferences"
            >
              {{ savingPreferences ? t('saving') : t('save') }}
            </BaseButton>
          </span>
        </div>
        <!-- Content -->
        <div class="grid grid-cols-2 gap-4">
          <BaseSelect
            v-model="preferences.exportFormat"
            :items="[t('settingsExportFormatCsv'), t('settingsExportFormatXlsx')]"
            :label="t('settingsExportFormatLabel')"
          />
          <BaseSelect
            v-model="preferences.exportDelimiter"
            :items="[t('settingsExportDelimiterSemicolon'), t('settingsExportDelimiterComma')]"
            :label="t('settingsExportDelimiterLabel')"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useUserStore } from '~/stores/user-store'
import { useAuth } from '~/composables/useAuth'
import type { UserPreferences } from '@shared/types'
import { BuildingOffice2Icon, HomeModernIcon } from '@heroicons/vue/24/outline'
import { Separator } from 'reka-ui'

const config = useRuntimeConfig()
const userStore = useUserStore()
const { validatePassword } = useAuth()
const { t } = useI18n()
// States
const loading = ref(true)
const error = ref<string | null>(null)
const savingProfile = ref(false)
const savingPreferences = ref(false)
const changingPassword = ref(false)

const API_BASE = config.public.baseApiUrl

const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
})

const initialProfile = ref({
  firstName: '',
  lastName: '',
  email: '',
})

const preferences = reactive<UserPreferences>({} as UserPreferences)
const isHydratingPreferences = ref(false)

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: '',
})

const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  if (typeof value === 'number') return value === 1
  return false
}

const toast = useToast()

const showSuccess = (message: string) => {
  toast.success({ message })
}

const showError = (message: string) => {
  toast.error({ title: t('toastErrorTitle'), message })
}

const persistPreferences = async (): Promise<boolean> => {
  if (!userStore.user?._id) {
    return false
  }

  const response = await fetch(`${API_BASE}/api/users/${userStore.user._id}/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  })

  if (!response.ok) {
    throw new Error(t('settingsPreferencesSaveError'))
  }

  return true
}

// loades current user data into profile form
const loadCurrentUser = () => {
  if (userStore.user) {
    profileForm.firstName = userStore.user.firstName || ''
    profileForm.lastName = userStore.user.lastName || ''
    profileForm.email = userStore.user.email || ''
    initialProfile.value = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
    }
  }
}

const resetProfileForm = () => {
  loadCurrentUser()
}

// loads user preferences from backend
const loadPreferences = async () => {
  try {
    if (!userStore.user?._id) return

    isHydratingPreferences.value = true
    const response = await fetch(`${API_BASE}/api/users/${userStore.user._id}/preferences`)

    if (!response.ok) {
      throw new Error(t('settingsPreferencesLoadError'))
    }

    const prefs = await response.json()
    Object.assign(preferences, prefs)
    preferences.darkMode = normalizeBoolean(preferences.darkMode)
  }
  catch (err) {
    console.error('Error loading preferences:', err)
    throw err
  }
  finally {
    isHydratingPreferences.value = false
  }
}

const resetPreferences = () => {
  loadPreferences()
}

const hasPreferencesChanges = async (): Promise<boolean> => {
  if (!userStore.user?._id) {
    return true
  }

  const currentResponse = await fetch(`${API_BASE}/api/users/${userStore.user._id}/preferences`)
  if (!currentResponse.ok) {
    return true
  }

  const current = await currentResponse.json()
  const currentPrefs = {
    darkMode: normalizeBoolean(current.darkMode),
    defaultLocation: current.defaultLocation,
    targetHoursPerWeek: current.targetHoursPerWeek,
    exportFormat: current.exportFormat,
    exportDelimiter: current.exportDelimiter,
  }

  return !(
    preferences.darkMode === currentPrefs.darkMode
    && preferences.defaultLocation === currentPrefs.defaultLocation
    && preferences.targetHoursPerWeek === currentPrefs.targetHoursPerWeek
    && preferences.exportFormat === currentPrefs.exportFormat
    && preferences.exportDelimiter === currentPrefs.exportDelimiter
  )
}

// saves profile changes to backend
const saveProfile = async () => {
  try {
    savingProfile.value = true
    error.value = null

    if (!userStore.user?._id) {
      throw new Error(t('authRequired'))
    }

    if (
      profileForm.firstName === initialProfile.value.firstName
      && profileForm.lastName === initialProfile.value.lastName
      && profileForm.email === initialProfile.value.email
    ) {
      return
    }

    const response = await fetch(`${API_BASE}/api/users/${userStore.user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
      }),
    })

    if (!response.ok) {
      throw new Error(t('settingsProfileSaveError'))
    }

    const updatedUser = await response.json()

    // update user in store
    userStore.user = { ...userStore.user, ...updatedUser }
    initialProfile.value = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
    }

    showSuccess(t('settingsProfileSaved'))
  }
  catch (err) {
    const message = err instanceof Error ? err.message : t('errorGeneric')
    error.value = message
    showError(message)
  }
  finally {
    savingProfile.value = false
  }
}

// saves user preferences to backend
const savePreferences = async () => {
  try {
    savingPreferences.value = true
    error.value = null

    if (!userStore.user?._id) {
      throw new Error(t('authRequired'))
    }

    const hasChanges = await hasPreferencesChanges()
    if (!hasChanges) {
      return
    }

    await persistPreferences()
    showSuccess(t('settingsPreferencesSaved'))
  }
  catch (err) {
    const message = err instanceof Error ? err.message : t('errorGeneric')
    error.value = message
    showError(message)
  }
  finally {
    savingPreferences.value = false
  }
}

// changes user password via backend firebase auth
const changePassword = async () => {
  try {
    changingPassword.value = true
    error.value = null

    // Validation
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      throw new Error(t('passwordAllFieldsRequired'))
    }

    if (passwordForm.new !== passwordForm.confirm) {
      throw new Error(t('passwordMismatch'))
    }

    if (passwordForm.current === passwordForm.new) {
      throw new Error(t('passwordSameAsCurrent'))
    }

    const validation = validatePassword(passwordForm.new)
    if (!validation.valid) {
      throw new Error(validation.message)
    }

    // api call for changing password via firebase auth in backend
    const response = await fetch(`${API_BASE}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
      }),
    })

    if (!response.ok) {
      throw new Error(t('passwordChangeError'))
    }

    // clear form
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''

    showSuccess(t('passwordChangeSuccess'))
  }
  catch (err) {
    const message = err instanceof Error ? err.message : t('errorGeneric')
    error.value = message
    showError(message)
  }
  finally {
    changingPassword.value = false
  }
}

// initial loading for user and preferences
const initialize = async () => {
  try {
    loading.value = true
    error.value = null

    if (!userStore.user?._id) {
      throw new Error(t('authRequired'))
    }

    loadCurrentUser()
    await loadPreferences()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('errorGeneric')
  }
  finally {
    loading.value = false
  }
}

watch(
  () => preferences.darkMode,
  async (isDark) => {
    userStore.theme = isDark ? 'night' : 'day'
    if (isHydratingPreferences.value) return

    try {
      await persistPreferences()
    }
    catch (err) {
      const message = err instanceof Error ? err.message : t('errorGeneric')
      showError(message)
    }
  },
)

onMounted(() => {
  initialize()
})
</script>

<style scoped>
.section-headline-description {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--color-disabled);
}
</style>
