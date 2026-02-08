<template>
  <div class="text-white p-4 px-8 flex items-center justify-center w-full">
    <Transition name="fade-slide">
      <p
        v-if="props.isOpen"
        class="flex-1 text-xl"
      >
        {{ userStore.displayName }}
      </p>
    </Transition>
    <BaseButton
      variant="text"
      @click="logout"
    >
      <ArrowRightEndOnRectangleIcon class="size-8" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline'

const { logout } = useAuth()
const userStore = useUserStore()

const props = defineProps<{
  isOpen: boolean
}>()
</script>

<style scoped>
.fade-slide-enter-active {
  transition: all 0.2s ease-out;
}

.fade-slide-leave-active {
  transition: all 0.1s ease-in;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-6px);
}

.fade-slide-leave-to {
  opacity: 0;
}
</style>
