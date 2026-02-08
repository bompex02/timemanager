<template>
  <div class="flex h-full bg-surface-100">
    <div
      v-if="!isReady"
      class="flex items-center justify-center w-screen"
    >
      {{ t('loading') }}
    </div>
    <Transition name="navbar-slide-in">
      <nav
        v-if="isNotOnLogin"
        class="h-full p-2"
      >
        <Navbar class="h-full" />
      </nav>
    </Transition>
    <Transition :name="isNotOnLogin ? 'navbar-slide-in' : ''">
      <main
        v-if="isReady"
        class="flex-1 overflow-y-auto"
        :class="[isNotOnLogin ? 'p-4' : '']"
      >
        <slot />
      </main>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const isReady = ref<boolean>(false)
const isNotOnLogin = computed(() => route.path !== '/login')

onMounted(() => {
  // set initial data - 'isReady' to true when finished
  isReady.value = true
})
</script>

<style scoped>
.navbar-slide-in-enter-active {
  transition:
    transform 0.6s ease-out,
    opacity 0.8s ease-out;
}
.navbar-slide-in-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
