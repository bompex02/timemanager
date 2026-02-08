import { defineStore } from 'pinia'
import { StorageSerializers } from '@vueuse/core'
import type { User } from '@shared/types'

export type Theme = 'system' | 'day' | 'night'

export const useUserStore = defineStore('user', () => {
  // serialized storage of user data 
  const user = useLocalStorage<User | null>('user', null, {
    serializer: StorageSerializers.object,
  })
  const selectedLang = useLocalStorage('lang', 'en')
  const theme = useLocalStorage<Theme>('theme', 'system')

  // function to clear user during logout
  const reset = () => {
    user.value = null
  }

  const setLang = () => {
    const nuxtApp = useNuxtApp()
    const i18n = nuxtApp.$i18n
    selectedLang.value = i18n?.locale?.value ?? selectedLang.value
  }

  const setUser = (currentUser: User) => {
    user.value = currentUser;
  }

  const isAuthentificated = computed(() => user.value !== null)

  const displayName = computed(() => {
    if (!user.value) return '-'
    return `${user.value.firstName} ${user.value.lastName}`.trim()
  })

  return {
    // variables
    user,
    selectedLang,
    theme,

    // computed
    isAuthentificated,
    displayName,

    // functions
    reset,
    setLang,
    setUser,
  }
})
