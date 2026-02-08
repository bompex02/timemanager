<template>
  <div class="h-dvh w-dvw">
    <ClientOnly>
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ClientOnly>
  </div>
</template>

<script setup lang='ts'>
const { t } = useI18n()
const route = useRoute()
const userStore = useUserStore()

const title = computed(() => {
  if (route.path === '/')
    return 'Chroniq | Home'
  return `Chroniq | ${t(route.path.slice(1))}`
})

const isPreferringDarkTheme = useMediaQuery('(prefers-color-scheme: dark)')
const currentTheme = computed(() => {
  if (userStore.theme === 'system') {
    if (isPreferringDarkTheme.value)
      return 'night'
    else
      return 'day'
  }
  return userStore.theme
})
const colorScheme = computed(() => {
  switch (currentTheme.value) {
    case 'day':
      return 'light'
    case 'night':
      return 'dark'
    default:
      return undefined
  }
})

useHead({
  title,
  htmlAttrs: {
    lang: () => (userStore.selectedLang),
  },
  bodyAttrs: {
    'data-theme': () => (currentTheme.value),
    'style': {
      'color-scheme': () => (colorScheme.value),
    },
  },
})
</script>
