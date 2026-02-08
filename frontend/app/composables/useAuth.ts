import { useUserStore } from '~/stores/user-store'
import type { User } from '@shared/types'

export function useAuth() {
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const config = useRuntimeConfig()
  const nuxtApp = useNuxtApp()
  const t = (key: string) => {
    const translator = nuxtApp.$i18n?.t
    return typeof translator === 'function' ? translator(key) : key
  }
  const toast = useToast();

  const API_BASE = config.public.baseApiUrl

  const isAuthentificatedLocalStorage = useLocalStorage('isAuthentificated', false)

  // made for implementation of token -> check if token is valid
  const isLoggedIn = computed(() => isAuthentificatedLocalStorage.value)

  // made for display of a loading state during login
  const isLoggingIn = ref(false)

  const thrownError = ref<Error>()

  const getErrorMessage = (err: unknown) => {
    if (!err) return t('errorGeneric')
    if (typeof err === 'string') return err
    if (typeof err === 'object') {
      const error = err as { data?: { message?: string }, message?: string, statusMessage?: string }
      return error.data?.message || error.message || error.statusMessage || t('errorGeneric')
    }
    return t('errorGeneric')
  }

  const showErrorToast = (message: string) => {
    if (toast?.error)
      toast.error({ title: t('toastErrorTitle'), message })
  }
  const showSuccessToast = (message: string) => {
    if (toast?.success)
      toast.success({ message })
  }
  
  const validatePassword = (password: string) => {
    if (!password || !password.trim())
      return { valid: false, message: t('passwordRequired') }
    if (password.length < 6)
      return { valid: false, message: t('passwordMinLength') }
    return { valid: true }
  }

 

  // register to firebase via backend api
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    isLoggingIn.value = true

    try {
      const validation = validatePassword(password)
      if (!validation.valid) {
        thrownError.value = new Error(validation.message)
        showErrorToast(validation.message ?? '')
        return
      }

      // send register request to backend api
      const response = await $fetch<{ user: User } | User>(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        body: { email, password, firstName, lastName },
      })

      // API returns either the user or an object like { user }
      const registeredUser: User = 'user' in response ? response.user : (response as User)
      userStore.setUser(registeredUser)

      isAuthentificatedLocalStorage.value = true
      showSuccessToast(t('registerSuccess'))

      const redirectForm = route.redirectedFrom
      if (redirectForm)
        await router.push(redirectForm.fullPath)
      else
        await router.push('/')
    }
    catch (err) {
      const message = getErrorMessage(err)
      thrownError.value = new Error(message)
      showErrorToast(message)
      console.error('Register error:', err)
    }
    finally {
      isLoggingIn.value = false
    }
  }

  // login to firebase via backend api and set user store
  const login = async (email: string, password: string) => {

    isLoggingIn.value = true

    try {
      // send login request to backend api
      const response = await $fetch<{ user: User } | User>(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        body: { email, password },
      })

      // API returns either the user or an object like { user }
      const loggedInUser: User = 'user' in response ? response.user : (response as User)
      userStore.setUser(loggedInUser)

      isAuthentificatedLocalStorage.value = true
      const loginName = loggedInUser.firstName ? `, ${loggedInUser.firstName}` : ''
      showSuccessToast(`${t('loginSuccess')}${loginName}`)

      const { redirectedFrom } = useRoute()

      if (redirectedFrom)
        await router.push(redirectedFrom.fullPath)
      else
        await router.push('/')
    }
    catch (err) {
      const message = getErrorMessage(err)
      thrownError.value = new Error(message)
      showErrorToast(message)
    }
    finally {
      isLoggingIn.value = false
    }
  }

  // logout to firebase via backand api and reset user store
  const logout = async () => {
    try {
      await $fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
      })
    }
    catch (err) {
      const message = getErrorMessage(err)
      showErrorToast(message)
      console.error('Logout error:', err)
    }

    isAuthentificatedLocalStorage.value = false
    const tempFirstName = userStore.user?.firstName
    userStore.reset()
    const logoutName = tempFirstName ? `, ${tempFirstName}` : ''
    showSuccessToast(`${t('logoutSuccess')}${logoutName}`)
    await router.push('/login')
  }

  // Change Password
  const changePassword = async (email: string, currentPassword: string, newPassword: string) => {
    try {
      const validation = validatePassword(newPassword)
      if (!validation.valid) {
        thrownError.value = new Error(validation.message)
        showErrorToast(validation.message ?? '')
        return
      }

      await $fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'POST',
        body: { email, password: currentPassword, newPassword },
      })
      showSuccessToast(t('passwordChangeSuccess'))
    }
    catch (err) {
      const message = getErrorMessage(err)
      thrownError.value = new Error(message)
      showErrorToast(message)
    }
  }

  return {
    register,
    login,
    logout,
    changePassword,
    validatePassword,
    isAuthentificated: readonly(isAuthentificatedLocalStorage),
    isLoggedIn: readonly(isLoggedIn),
    isLoggingIn: readonly(isLoggingIn),
  }
}
