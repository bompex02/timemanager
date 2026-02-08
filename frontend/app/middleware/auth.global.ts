import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()

  const isOnLoginPage = to.path === '/login'
  if (isOnLoginPage && isLoggedIn.value)
    return navigateTo('/')

  if (!isOnLoginPage && !isLoggedIn.value)
    return navigateTo('/login')
})
